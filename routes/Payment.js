// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
} = require("../controllers/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", auth, isStudent)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent
)
// router.post("/verifySignature", verifySignature)

module.exports = router;
