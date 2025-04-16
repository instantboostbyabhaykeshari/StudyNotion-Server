const mongoose = require("mongoose");

//Define the rating and review schema
const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true
    }
});


const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);
//Exports the rating and review model
module.exports = RatingAndReview;