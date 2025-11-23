const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-phone/request', authController.requestPhoneVerification);
router.post('/verify-phone/confirm', authController.confirmPhoneVerification);

module.exports = router;
