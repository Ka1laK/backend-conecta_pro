const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/home', clientController.getHome);
router.get('/locations', clientController.getLocations);
router.post('/locations', clientController.createLocation);
router.get('/payment-methods', clientController.getPaymentMethods);
router.post('/payment-methods', clientController.createPaymentMethod);
router.post('/service-request', clientController.createServiceRequest);
router.get('/service-requests', clientController.getServiceRequests);
router.post('/service-request/:requestId/review', clientController.createReview);

module.exports = router;
