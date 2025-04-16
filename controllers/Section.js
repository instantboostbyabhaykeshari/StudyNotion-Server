const Section = require("../models/Section");
const Course = require("../models/Course");

//Create handler function
exports.createSection = async(req, res) => {
    try{
        //Fetch data from req.body 
        const {sectionName, courseID} =req.body;

        //Validation 
        if(!sectionName || !courseID){
            return res.status(401).json({
                success: false,
                message: "All fields are required."
            });
        }

        //Create new section
        const newSection = await Section.create({sectionName});

        //Update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                            {courseID},
                                                            {
                                                                $push: {
                                                                    courseContent: newSection._id
                                                                }
                                                            },
                                                            {new:true}
        )
        console.log(updatedCourseDetails);
        //HW - Use populate to update section/subSection both in updatedCourseDetails

        //Send successful response
        return res.status(200).json({
            success: true,
            message: "Section created successfully.",
            updatedCourseDetails
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Section creation failed."
        });
    }
}

//Update handler function
exports.updateSection = async(req, res) => {
    try{    
        //Fetch new data
        const {sectionName, sectionId} =req.body;

        //Validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Something is missing."
            });
        }

        //Upadate data in into DB
        const updatedSection = await Section.findByIdAndUpdate(
                                        {sectionId},
                                        {sectionName: sectionName},
                                        {new: true}
                                        )
        console.log(updatedSection);

        //Send successful response
        return res.status(201).json({
            success: true,
            message: "Section update successfully."
        });
    }catch(err) {
        console.log(err);
        return res.status(201).json({
            success: false,
            message: "Unable to update section, please try again.",
            err: message.err
        });
    }
}

//Delete handler function
exports.deleteSection = async(req, res) => {
    try{
        //Fetch sectionId, assuming that we are sending ID in params.
        const {sectionId} = req.params;

        //Delete section into DB
        await Section.findByIdAndDelete({sectionId});

        //Return successful response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully."
        });

        // TODO[Testing] -> Do we need to delete the entry from the course schema ??
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again later.",
            err: message.err
        })
    }
}