const Category = require("../models/Category");
const Course = require("../models/Course.js");
const User = require("../models/User.js");

//Create category ka handler function
exports.createCategory = async(req, res) => {
    try{
        //Fetch data from req.body
        const {name, description} = req.body;

        //Validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All details are required, please enter all the details."
            })
        }

        //Create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description
        });
        console.log(categoryDetails);

        //Return successful response
        return res.status(201).json({
            success: true,
            message: "Category is created successfully"
        });
    }catch(err){
        console.log(err);
        return rs.status(500).json({
            success: false,
            message: "Failed to create categories."
        });
    }
}

//Get all categories handler function -> Show all tags
exports.showAllCategories = async(req, res) => {
    try{
        //Get all category details from DB using find method
        const allCategories = await Category.find();
        console.log(allCategories);

        //Return successful response
        return res.status(200).json({
            success: true,
            message: "Get all category details successfully.",
            data: allCategories,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//Category page details
exports.categoryPageDetails = async(req, res) => {
    try{
        //Get categoryId from req.body
        const {categoryId} =req.body;
        console.log("CategoryId: ", categoryId);
        
        //Get courses for specified categories
        const selectedCategory = await Category.findById(categoryId)
                                                        .populate({
                                                            path: "course",
                                                            match: {status: "Published"}
                                                        })
                                                        .exec();

        console.log("SELECTED COURSE: ", selectedCategory);
        //Validation
        if(!selectedCategory){
            console.log("Category not found.");
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // Handle the case when there are no courses
        if (!selectedCategory.course) {
            console.log("No courses found for the selected category.")
            // return res.status(404).json({
            // success: false,
            // message: "No courses found for the selected category.",
            // })
        }

        //Get all courses regarding selected category
        const allCoursesRegardingSelectedCategory = await Course.find({category: categoryId}).sort({ createdAt: -1 }).populate({
            path: "instructor",
        })
        .exec();

        //Recent -> new courses
        const recentCourses = await Course.find({category: categoryId}).limit(4).populate({
            path: "instructor",
        })
        .exec();

        //Get courses for different category
        const differentCategory = await Category.find({_id: {$ne: categoryId}}).populate("course").exec();
        
        //Validation
        if(!differentCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        //Get top 10 selling course 

        //Return successful response
        return res.status(202).json({
            success: true,
            message: "Category page details created successfully.",
            data: {
                selectedCategory,
                differentCategory,
                allCoursesRegardingSelectedCategory,
                recentCourses
            }
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Category page details failed to form."
        });
    }
}
