const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.patch('/me/personal-info', userController.updatePersonalInfo);

module.exports = router;
