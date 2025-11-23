const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/identity/options', verificationController.getIdentityOptions);
router.post('/identity/document', protect, verificationController.uploadIdentityDocument);
router.get('/identity/status', protect, verificationController.getVerificationStatus);

module.exports = router;
