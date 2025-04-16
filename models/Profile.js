const mongoose = require("mongoose");

//Define the profile schema
const profileSchema = mongoose.Schema({
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    bio: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    }
});

//Exports the profile model
module.exports = mongoose.model("Profile", profileSchema);