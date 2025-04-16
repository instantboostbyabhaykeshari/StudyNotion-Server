let jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = (req, res, next) => {
    try {
        //Fetch token from body, cookies, header
        let token = req.cookies.Token ;
        // console.log("Token in auth: ",token);
        
        //Validation of token 
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token is missing."
            });
        }

        //Verify Token -> verify method use
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        }catch(err){
            //Verification issue
            console.log(err);
            return res.status(403).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Token verification failed."
        })
    }
}

//isStudent
exports.isStudent = (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: true,
                message: "This is the protected routes for student only."
            });
        }

        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "There is an error in verifying student login."
        });
    }
}

//isInstructor 
exports.isInstructor = (req, res, next) => {
    // console.log("Account Type Printing", req.user.accountType);
    console.log("Abhay...............................................................................", req.user);
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is the protected routes for instructor only."
            }); 
        }

        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "There is an error in verifying instructor login."
        })
    }
}

//isAdmin
exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: true,
                message: "This is the protected routes for admin only."
            }); 
        }

        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "There is an error in verifying admin login."
        })
    }
}