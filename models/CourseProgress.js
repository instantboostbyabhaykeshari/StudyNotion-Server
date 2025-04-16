const mongoose = require("mongoose");

//Define the course progress schema
const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    completedVIdeo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
    }]
});

// Exports the model
module.exports = mongoose.model("CourseProgress", courseProgressSchema);