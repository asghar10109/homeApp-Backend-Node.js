const router = require('express').Router();
const {UserRegisteration,
        UserLogin,
        ForgotPassword,
        OtpCheck,
        ResetPassword,
        checkCM} = require('../controllers/UserController')

router.post('/create' , UserRegisteration);
router.post('/login' , UserLogin);
router.post('/forgot-password', ForgotPassword);
router.post('/OTP/verification', OtpCheck);
router.post('/reset-password', ResetPassword);
router.get('/check-api', checkCM);

module.exports = router;