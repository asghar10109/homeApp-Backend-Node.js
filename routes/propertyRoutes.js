const router = require('express').Router();
const AttachmentUpload = require('../helpers/AttachmentUpload');
const {PropertyCreate,
    PropertyUpdate,
    GetProperties,
    SendAttachment,
    Properties_Details
} = require('../controllers/PropertyController')
    
router.post('/create', PropertyCreate);
router.post('/update', PropertyUpdate);
router.get('/properties', GetProperties);
router.post('/upload-attachment',AttachmentUpload.upload ,SendAttachment);
router.get('/properties/:pid' , Properties_Details)


module.exports = router;