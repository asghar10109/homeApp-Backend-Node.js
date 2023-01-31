const router = require('express').Router();
const Auth = require("../middlewares/Authentication");
const {UserRegisteration,
        UserLogin,
        ForgotPassword,
        OtpCheck,
        ResetPassword,
        UpdatePassword,
        VerifyRegisteredUser} = require('../controllers/UserController')

router.post('/create' , UserRegisteration);
router.post('/login' , UserLogin);
router.post('/forgot-password', ForgotPassword);
router.post('/OTP/verification', OtpCheck);
router.post('/reset-password', ResetPassword);
router.post('/welcome', Auth,VerifyRegisteredUser);
router.post('/update-password',Auth,UpdatePassword);

module.exports = router;