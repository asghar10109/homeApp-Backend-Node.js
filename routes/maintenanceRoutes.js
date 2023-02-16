const router = require('express').Router();
const {
    CreateMaintenance,
    GetAllMaintenance,
    GetSpecficTenant
} = require('../controllers/MaintenanceController')
    
router.post('/add', CreateMaintenance);
router.get('/getall', GetAllMaintenance);

router.get('/tenant/:id', GetSpecficTenant);



module.exports = router;