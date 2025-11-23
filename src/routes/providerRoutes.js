const express = require('express');
const router = express.Router();
const providerController = require('../controllers/ProviderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Dashboard
router.get('/home', providerController.getHome);

// Services CRUD
router.get('/services', providerController.getServices);
router.post('/services', providerController.createService);
router.get('/services/:serviceId', providerController.getServiceDetails);
router.patch('/services/:serviceId', providerController.updateService);

// Service Requests
router.get('/service-requests', providerController.getServiceRequests);
router.get('/service-request/:requestId', providerController.getServiceRequestDetails);
router.post('/service-requests/:requestId/accept', providerController.acceptRequest); // Note: Spec says /provider/service-requests/:requestId/accept
router.post('/service-requests/:requestId/reject', providerController.rejectRequest); // Note: Spec says /provider/service-requests/:requestId/reject
router.post('/service-request/:requestId/cancel', providerController.cancelRequest); // Note: Spec says /provider/service-request/:requestId/cancel (singular)

// Reviews
router.get('/reviews', providerController.getReviews);

module.exports = router;
