const router = require('express').Router();
const AttachmentUpload = require('../helpers/AttachmentUpload');
const {PropertyCreate,
    PropertyUpdate,
    GetProperties,
    SendAttachment
} = require('../controllers/PropertyController')
    
router.post('/create', PropertyCreate);
router.post('/update', PropertyUpdate);
router.get('/properties', GetProperties);
router.post('/upload-attachment',AttachmentUpload.upload ,SendAttachment);


module.exports = router;