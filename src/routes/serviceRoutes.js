const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServiceController');
const { protect } = require('../middlewares/authMiddleware');

// Note: Spec implies some might be public, but "Reglas de Negocio" says "Todos estos endpoints... requieren el middleware protect".
// I will apply protect to all for now as per strict requirement.

router.get('/categories/:categoryId/services', protect, serviceController.getServicesByCategory);
router.get('/services/top', protect, serviceController.getTopServices);
router.get('/services/search', protect, serviceController.searchServices); // Order matters: search before :serviceId
router.get('/services/:serviceId', protect, serviceController.getServiceDetails);

module.exports = router;
