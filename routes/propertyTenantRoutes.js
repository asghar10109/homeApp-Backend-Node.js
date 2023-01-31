const router = require('express').Router();
const {AddTenant} = require('../controllers/PropertyTenantController')
    
router.post('/add', AddTenant);


module.exports = router;