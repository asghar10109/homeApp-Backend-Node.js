const router = require('express').Router();
const { 
    Rent_Tracking_Up_todate,
    Rental_Tracking_Updates_Get
 } = require('../controllers/RentalTrackingController');

router.post('/create' , Rent_Tracking_Up_todate);
router.get('/getAll' ,  Rental_Tracking_Updates_Get);
module.exports = router