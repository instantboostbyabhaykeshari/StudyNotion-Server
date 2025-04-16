const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")
const {
  updateProfile,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth)
router.put("/updateDisplayPicture", auth)
router.get("/instructorDashboard", auth)

module.exports = router
