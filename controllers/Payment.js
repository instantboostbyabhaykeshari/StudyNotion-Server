const { default: mongoose } = require("mongoose");
const instance = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

//Capture the payment and initiate the razorpay order
exports.capturePayment = async(req, res) => {
    //Fetch data from req.body
    const {courses} = req.body;
    const userId = req.user.id;

    //Validation on courses
    if(courses.length === 0){
        return res.status(401).json({
            success: false,
            message: "No any courses added."
        });
    }

    //

    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(400).json({
                    success: false,
                    message: "Please add the courses"
                });
            }

            const uid = mongoose.Types.ObjectId(userId);

            if(Course.studentEnrolled.includes(uid)){
                return res.status(402).json({
                    success: false,
                    message: "Student already enrolled in this course."
                });
            }

            totalAmount += Course.price;
        }catch(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "There is internal server error in adding price of courses present in cart items."
            });
        }
    }
}



//Capture the payment and initiate the razorpay order
// exports.capturePayment = async(req, res) => {
//     try{
//         //Get courseId and userId
//         const {courseId} = req.body;
//         const userId = req.user.id;
//         //Validation -> Valid courseId
//         if(!courseId){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide valid course Id."
//             });
//         }
//         //Valid courseDetails
//         let course;
//         try{
//             course = await Course.findById(courseId);
//             if(!course){
//                 return res.status(401).json({
//                     success: false,
//                     message: "Could not find the course."
//                 });
//             }

//             //User already pay for the same course
//             const uid = await mongoose.Schema.ObjectId(courseId);
//             if(Course.studentEnrolled.includes(uid)){
//                 return res.status(201).json({
//                     success: false,
//                     message: "Student already enrolled in this course."
//                 });
//             }
//         }catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: "There is something errors in courseDetails.",
//                 err: message.err
//             });
//         }

//         //Create Orders
//         const amount = Course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount*100,
//             currency: currency,
//             receipt: math.random(Date.now()).toString(),
//             notes: {
//                 courseId: courseId,
//                 userId: uid
//             }
//         } 

//         //Initiate the payment using razorPay -> Order create
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //Return successful response
//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully.",
//             courseName: Course.courseName,
//             courseDescription: Course.description,
//             thumbnail: Course.thumbnail,
//             orderId: paymentResponse.id,
//             amount: paymentResponse.amount,
//             currency: paymentResponse.currency 
//         });
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create order.",
//             err: message.err
//         });
//     }
// }

// //Verify signature of razorpay and server
// exports.verifySignature = async(req, res) => {
//     //Make webHookSecret key
//     const webhookSecret = "12345678";
//     //Fetch razorpay hashing secret key from headers
//     const signature = req.headers["x-razorpay-signature"];
//     //Hashed webHookSecret key like razorpay secret key using below three methods
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(Json.stringify(req.body));
//     const digest = shasum.digest("hex");

//     //Veification of signature
//     if(signature === digest){
//         console.log("Payment is authorised.");

//         //Get userId, courseId
//         const {userId, courseId} =req.body.payload.entity.notes;

//         //Fullfill the action 
//         //Find the course and enrolled the student in it.
//         try{
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                                                                 {_id: courseId},
//                                                                 {$push: {
//                                                                     studentEnrolled: userId
//                                                                 }},
//                                                                 {new: true}
//             ); 

//             if(!enrolledCourse){
//                 return res.status(400).json({
//                     success: false,
//                     message: "There is something error in enrolling in course."
//                 });
//             }
//             console.log(enrolledCourse);

//             //Find the student and add the course in their course list.
//             const enrolledStudent = await User.findByIdAndDelete({_id: userId},
//                                                                 {$push: {
//                                                                     course: courseId
//                                                                 }},
//                                                                 {new: true}
//             );
//             console.log(enrolledStudent);

//             //Confirmation ka mail send krdo
//             const sendConfirmationEmail = mailSender(enrolledStudent.email, "Congratulations from Codehelp", "Congratulations, you are enrolled in new course.");

//             //Return successful response
//             return res.status(201).json({
//                 success: true,
//                 message: "Signature verified successfully and student enrolled in course."
//             });
//         }catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: "Signature verification failed.",
//             })
//         }
//     }else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request."
//         });
//     }
// }


