const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.patch('/me/personal-info', protect, userController.updatePersonalInfo);

module.exports = router;
