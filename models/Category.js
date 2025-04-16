const mongoose = require("mongoose");

//Define the category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }
});

const Category = mongoose.model("Category", categorySchema);
//Exports the category model
module.exports = Category;