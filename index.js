const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");

const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const profileRoutes = require("./routes/Profile");
const userRoutes = require("./routes/User");
const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");

dotenv.config();
const PORT = process.env.PORT || 4000;

//Middileware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));
app.use(fileUpload(
  {
    useTempFiles: true,
    tempFileDir: "/tmp"
  }
));

//Database connectins
database.connect();

//Cloudinary connectins
cloudinaryConnect();

//Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//Default routes 
app.get("/", (req, res)=>{
  res.send("Server is running up")
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
