const router = require('express').Router();
const { 
    Rent_Tracking_Up_todate,
    Rental_Tracking_Updates_Get,
    For_Each_User_Info
 } = require('../controllers/RentalTrackingController');

router.post('/create' , Rent_Tracking_Up_todate);
router.get('/getAll' ,  Rental_Tracking_Updates_Get);
router.get('/PropertyTenant/:id' , For_Each_User_Info);
module.exports = router