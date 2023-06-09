const router = require('express').Router();
const Auth = require('../middlewares/Authentication');
const AttachmentUpload = require('../helpers/AttachmentUpload');
const { PropertyCreate,
    PropertyUpdate,
    GetProperties,
    SendAttachment,
    Properties_Details,
    GetTenantProperties
} = require('../controllers/PropertyController')

router.post('/create', PropertyCreate);
router.post('/update', PropertyUpdate);
router.get('/properties', Auth, GetProperties);
router.get('/tenantproperties', Auth, GetTenantProperties);
router.post('/upload-attachment', AttachmentUpload.upload, SendAttachment);
router.get('/properties/:pid', Properties_Details)


module.exports = router;