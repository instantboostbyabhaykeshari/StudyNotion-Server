const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//Create sub-section
exports.createSubSection = async(req, res) => {
    try{
        //Fetch data from req.body
        const {sectionId, title, description, timeDuration} = req.body;

        //Fetch file(video) req.file
        const video = req.file.videoFile;

        //Validation -> All fields are required
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(403).json({
                success: false,
                message: "All fields are required."
            });
        }

        //Upload video on cloudinary -> for secure_url
        const videoDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //Create sub-section
        const subSectionDetails = SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            video: (await videoDetails).secure_url
        });
        
        //Upload section with this sub-section objectId
        await Section.findByIdAndUpdate({sectionId},{
                                            $push: {
                                                subSection: (await subSectionDetails)._id
                                            }
                                        },
                                        {new: true});
        //Return successful response
        return res.status(201).json({
            success: true,
            message: "Sub-section created successfully."
        });

        //HW - Log updated section here, after adding populate method
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            meesage: "Creation of sub-section failed, please try again.",
            err: message.err
        });
    }
}

//HW - Update SubSection
//HW - Delete SubSection