const express = require('express');
const router = express.Router();
const providerController = require('../controllers/ProviderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/service-requests', providerController.getServiceRequests);
router.post('/service-requests/:requestId/accept', providerController.acceptRequest);
router.post('/service-requests/:requestId/reject', providerController.rejectRequest);

module.exports = router;
