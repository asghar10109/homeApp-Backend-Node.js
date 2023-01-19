const User = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxdec0056748824aa794943b45be2c1283.mailgun.org';
const mg = mailgun({apiKey:'0a0545928caf383737e9e907d42b0637-f7d687c0-03fe37d3', domain: DOMAIN});

const UserRegisteration = async (req, res, next) => {
    try {
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt( req.body.password ,process.env.SECRET_PASSWORD).toString(),
            image: req.body.image,
        })


        const savedUser = await newUser.save();
        res.send({
            message: "Your Data Saved Successfully",
            status: 201,
            data: savedUser
        })
    } catch (err) {
        res.send({
            message: "Data Already Exist",
            status: 404
        })
    }

}

// Login Api start here
const UserLogin = async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        const originalpassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PASSWORD).toString(CryptoJS.enc.Utf8)
        if(!user){
            res.send({
                message:"Invalid Email",
                status:404
            })
        }
        else if(originalpassword !== req.body.password){
            res.send({
                message:"Invalid Password",
                status:404
            })
        }
        else {
            const access_token = jwt.sign(
                { 
                id: user._id,
                },process.env.JWT_TOKEN , { expiresIn:"2d" })

            const {password,...detail} = user._doc
            res.send({
                message:"Loggedin Successfully",
                status:200,
                data:{detail,access_token}
            })
        }     
    } catch(error){
        res.send({
            message:"Invalid Credentails",
            status:500
        })
    }
}
const ForgotPassword = async (req,res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({error: "User with this email does not exist"});
        }
        var random = Math.floor(Math.random() * 1000000);
        const data = {
            from: 'HomeApp <noreplay@gmail.com>',
            to: email,
            subject: 'Reset Password',
            html:`
                <h2>Reset Password OTP</h2>
                <h3>${random}</h3>            
            `
        };
        return user.updateOne({otp:random},function(err,success){
            if(err){
                return res.status(400).json({error: "OTP error"});
            }else{
                mg.messages().send(data, function (error, body) {
                    if(error) {
                        return res.json({
                            error: error.message
                            // error: "Email not sent"
                        })
                    }
                    return res.json({message: "Email has been sent"});
                });
            }
        });
    })
}

const OtpCheck = async (req,res) => {
    const {otp,email} = req.body;
    if(otp && email){
        User.findOne({email}, (err, user) => {
            if(err || !user){
                return res.status(400).json({error: "User does not exist"});
            }else{
                user.findOne({otp:otp}, function(err, success){
                    if(err){
                        return res.status(400).json({error: "Incorrect OTP"});
                    }else{
                        return res.json({message: "OTP Success"});
                    }
                })
            }

        })
    }else{
        return res.status(401).json({error: "Authentication Error"});
    }
}

const ResetPassword = async (req,res) => {

    if(req.body.email){
        const {newPass,email} = req.body;
        User.findOne({email}, (err, user) => {
            if(err || !user){
                return res.status(400).json({error: "User with this email does not exist"});
            }
            var pass = CryptoJS.AES.encrypt( newPass ,process.env.SECRET_PASSWORD).toString();
            return user.updateOne({password:pass}, function(err, success){
                if(err){
                    return res.status(400).json({error: "Reset Password Error"});
                }else{
                    return res.json({message: "Password Successfully Changed"});
                }
            })
        })
    }else{
        return res.status(400).json({error: "Email Required"});
    }
}

const checkCM = async (req,res) => {
    return res.json({message: "working"});
}

module.exports = {
    UserRegisteration,
    UserLogin,
    ForgotPassword,
    OtpCheck,
    ResetPassword,
    checkCM
}


