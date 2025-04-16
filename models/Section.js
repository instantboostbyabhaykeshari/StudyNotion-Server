const mongoose = require("mongoose");

//Define the section schema
const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
    },
    subSection: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection",
    }]
});

const Section = mongoose.model("Section", sectionSchema);
//Exports the section model
module.exports = Section;