const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//sendOTP
exports.sendOTP = async(req, res) => {
    try{
        //Fetch email from req.body
        const {email} = req.body;

        //Check if user already exit
        const checkUserPresent = await User.findOne({email});

        //If user already exit, then send response
        if(checkUserPresent){
            return res.status(400).json({
                status: false,
                message: "User already registerd",
            });
        }

        //Generate OTP
        let otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        //Check opt is unique or not
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        //Create an entry for otp in DB
        let payLoad = {email, otp};
        let otpBody = await OTP.create(payLoad);
        console.log(otpBody);

        //Response send
        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            otp,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


//SignUp
exports.signUp = async(req, res) => {
    try {
        //Data fetch from request ki body
        let {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
        } = req.body;

        // Validation of data
        if(!firstName || !lastName || !email|| !password || !confirmPassword || !otp){
            return res.status(401).json({
                status: false,
                message: "Please entered all the required details..."
            });
        }

        //Match password and confirmPassword
        if(password !== confirmPassword){
            return res.status(402).json({
                success: false,
                message: "Password and confirmPassword are not match. Please try again."
            });
        }

        //Check user already exit or not
        const exisitngUser = await User.findOne({email});
        if(exisitngUser){
            return res.status(403).json({
                success: false,
                message: "User is already registered."
            });
        }

        //Find most recent OTP stored for the user
        const recentOTP = await OTP.findOne({email}).sort({createdAt: -1});
        // console.log("RecentOtp is: ", recentOTP);

        //verify OTP
        if(!recentOTP){
            //OTP not found
            return res.status(401).json({
                success: false, 
                message: "OTP not found"
            })
        }else if(otp !== recentOTP.otp){
            return res.status(401).json({
                success: false,
                message: "OTP, you entered are wrong. Please enter correct OTP."
            });
        }

        //Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //Create entry in DB
        const profileDetails = {
            gender: null,
            dateOfBirth: null,
            bio: null,
        }


        await User.create({
            firstName,
            lastName,
            email,
            accountType,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName}${lastName}`
        });

        //Response Send
        res.status(200).json({
            success: true,
            message: "User registered successfully."
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again."
        })
    }
}


//Login
exports.login = async(req, res) => {
    try {
        //Get data from request ki body
        let {email, password} = req.body;

        //Validation on email and password
        if(!email || !password){
            return res.status(403).json({
                success: true,
                message: "All fields are required. So, Please enter all details"
            });
        }

        //Check user exit or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: true,
                message: "User not registered. Please registered first."
            })
        }

        //Password matching
        if(await bcrypt.compare(password, user.password.toString())){
            //Generate JWT
            let payLoad = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            console.log("Sanyam..................................................", payLoad);


            let token = jwt.sign(payLoad, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            console.log("Token in login: ",token);

            user.token = token;
            user.password = undefined;

            //Create cookie
            const options = {
                expire: new Date(Date.now + 3*24*60*60),
                httpOnly: true
            }
            res.cookie("Token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in succesfully."
            });
        }else {
            res.status(201).json({
                success: false,
                message: "Password entered is incorrect."
            });
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//Change Password
exports.changePassword = async(req, res) => {
    try {
        //Get data from request ki body
        let {oldPassword, newPassword, confirmNewPassword} = req.body;

        //Validation of all details
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "Entered all the details."
            });
        }

        //Check oldPassword entered are correct or not
        if(oldPassword !== User.password){
            return res.status(401).json({
                success: false,
                message: "You entered wrong old password."
            });
        }

        //Check newPassword and confirmNewPassword are same
        if(newPassword !== confirmNewPassword){
            return res.status(403).json({
                success: true,
                message: "New Password and Confirm New Password are not matched."
            });
        }

        //Update password in DB
        const updatePassword = await User.updateOne(password, newPassword);
        console.log(updatePassword);

        //Send mail -> Password Updated
        const updatedPassMail = await mailSender(updatePassword.email, "StudyNotion Password Updated", "Password updated successfully");

        //Successfully updated password response send
        res.status(200).json({
            success: true,
            message: "Successfully updated password."
        })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while changing password."
        })
    }
}