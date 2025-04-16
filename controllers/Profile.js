const Profile = require("../models/Profile");
const User = require("../models/User");

//Update profile handler function
exports.updateProfile = async(req, res) => {
    try{
        //Fetch data from req.body
        const {gender, dateOfBirth, bio} = req.body;

        //Get userId -> req.user = decode
        const userId = req.user.id;

        //Validation 
        if(!gender || !dateOfBirth || !bio || !userId){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            });
        }
        
        //Find profile using profileId
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;
        //Add data into profile
        const profileDetails = await Profile.findById(profileId);
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.bio = bio;

        //Save details into DB
        await profileDetails.save();

        //Return successful response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to update profile, please try again.",
            err: message.err
        });
    }
}

//Delete account 
