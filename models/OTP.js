const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

//Define the otp schema
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10*60, // The The document will be automatically deleted after 5 minutes of its creation time
    }
});

//Define a function to send emails
async function sendVerificationEmail (email, otp){
    // Create a transporter to send emails
	// Define the email options
	// Send the email
    try{
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", emailTemplate(otp));
        console.log("Verification email send succefully: ", mailResponse);
    }catch(err){
        console.log("Error occured while sending mails: ", err);
        throw err;
    }
}

// Define a pre-save hook to send email after the document has been saved
otpSchema.pre("save", async function(next){
    if(this.isNew){
        await sendVerificationEmail (this.email, this.otp);
    }
    next();
});


const OTP = mongoose.model("OTP", otpSchema);
//Exports the model.
module.exports = OTP;