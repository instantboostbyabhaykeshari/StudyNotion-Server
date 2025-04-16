const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = ()=> {
    mongoose.connect(process.env.MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    }).then(()=> {
        console.log("DB connection made successfully.");
    }).catch((err) => {
        console.log(err);
        console.log("DB connection failed");
        process.exit(1);
    })
}