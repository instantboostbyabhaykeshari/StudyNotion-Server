const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/ContactUs");

//Create route for contact us
router.post("/contact", contactUsController);

module.exports = router;