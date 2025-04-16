const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//Create rating and review
exports.createRating = async(req, res) => {
    try{
        //Get userId
        const userId = req.user.id;

        //Fetch data from req.body
        const {rating, review, courseId} = req.body;

        //Validation
        if(!rating || !review || !userId || !courseId){
            return res.status(403).json({
                success: false,
                message: "All fields are required."
            });
        }

        //Check if user enrolled or not
        const courseDetails = await Course.findOne({courseId, studentEnrolled: {$elemMatch: {$eq: userId}}});
        if(!courseDetails){
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course."
            });
        }

        //Check user already review this course
        const alreadyReviewed = await RatingAndReview.findOne({course:courseId, user:userId});
        if(alreadyReviewed){
            return res.status(401).json({
                success: false,
                message: "You already review this course."
            });
        }

        //Add this rating and review in DB -> create this
        const ratingReview = await RatingAndReview.create({
            user: userId,
            rating: rating,
            review: review,
            course: courseId
        });
        console.log(ratingReview);

        //Add rating and review id course schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                        {_id: courseId},
                                        {
                                            $push: {
                                                ratingAndReview: ratingReview._id
                                            }
                                        },
                                        {new: true}
        );
        console.log(updatedCourseDetails);

        //Return successful response
        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully.",
            ratingAndReview
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Rating and review creation failed."
        }); 
    }
}

//Get average rating
exports.getAverageRating = async(req, res) => {
    try{
        //Get courseId
        const {courseId} =req.body.courseId;

        //Calculate average rating
        const result = RatingAndReview.aggregate([
            {
                $match: {
                    course: mongoose.Schema.ObjectId(courseId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "rating"}
                }
            }
        ]);

        //Return rating 
        if(result.length>0){
            return res.status(201).json({
                success: true,
                averageRating: result[0].averageRating
            });
        }
        
        //If no rating and review exist
        return res.status(200).json({
            success: true,
            message: "No rating and review exist till now.",
            averageRating: 0
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to find average rating."
        });
    }
}

//Get all rating and reviews
exports.getAllRatingAndReview = async(req, res) => {
    try{
        //DB call using find method
        const allRatingReview = await RatingAndReview.find({})
                                                    .populate({
                                                        path: "user",
                                                        select: "firstName lastName email image"
                                                    })
                                                    .populate({
                                                        path: "course",
                                                        select: "courseName"
                                                    })
                                                    .exec();
        //Return successful response
        return res.status(200).json({
            success: true,
            message: "All rating and reviews get successfully.",
            data: allRatingReview
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get all rating and review."
        });
    }
}