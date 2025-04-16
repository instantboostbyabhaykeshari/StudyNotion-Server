const mongoose = require("mongoose");

// Define the subSection Schema
const SubSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    timeDuration: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    video: {
        type: String,
        required: true,
    }

});

const SubSection = mongoose.model("SubSection", SubSectionSchema);
//Exports the subsection model
module.exports = SubSection;