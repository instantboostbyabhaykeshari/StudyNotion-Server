const bcrypt = require("bcrypt");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

//Reset password token
exports.resetPasswordToken = async(req, res) => {
    try{
        //Get email from request ki body
        const {email} = req.body;

        //Email validation
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Please enter the email."
            });
        }

        //Check user exist or not for this email
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(400).json({
                success: true,
                message: "User is not registered with us"
            });
        }

        //Generate token
        const token = crypto.randomUUID();

        //Update User by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email: email}, {token: token,
                                                                            resetPasswordExpires: Date.now()+5*+60*1000,
                                                                            },
                                                                            {new: true}
                                                                            );
        console.log(updatedDetails);

        //Create URL
        const url = `http://localhost:3000/updated-password/${token}`;

        //Send email containg the url
        const emailSend = mailSender(email, "StudyNotion password reset", `Reset password url:- ${url}`);
        console.log(emailSend);
        
        //Return Successful response
        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: true,
            message: "There is something error in while sending email to registered user."
        });
    }

}

//Reset password
exports.resetPassword = async(req, res) => {
    try{
        //Fetch data from request.body -> password, confirmPassword, token
        let {password, confirmPassword, token} = req.body;
        
        //Validation
        if(password !== confirmPassword || !password || !confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password are not same or Enter all the details."
            });
        }

        //Get user details from DB using token
        const userDetails = await User.findOne({token: token});

        //Check for token 
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        //Check for expiration of token
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Link is expired. Please regenerate the link."
            });
        }

        //Hashed password
        const hashedPassword = bcrypt.hash(password, 10);
        
        //Password update
        await User.findOneAndUpdate({token: token},
                                    {
                                        password: hashedPassword
                                    },
                                    {
                                        new: true
                                    });
        return res.status(201).json({
            success: true,
            message: "Password reset successfully."
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting password."
        });
    }
}

