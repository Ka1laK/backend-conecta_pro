const serviceService = require('../services/ServiceService');
const createResponse = require('../utils/response');

class ServiceController {
    async getServicesByCategory(req, res, next) {
        try {
            const { categoryId } = req.params;
            const { page, page_size, search } = req.query;
            const data = await serviceService.getServicesByCategory(categoryId, parseInt(page), parseInt(page_size), search);
            res.json(createResponse(true, 'Services retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getTopServices(req, res, next) {
        try {
            const { page, page_size } = req.query;
            const data = await serviceService.getTopServices(parseInt(page), parseInt(page_size));
            res.json(createResponse(true, 'Top services retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getServiceDetails(req, res, next) {
        try {
            const { serviceId } = req.params;
            const data = await serviceService.getServiceDetails(serviceId);
            res.json(createResponse(true, 'Service details retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async searchServices(req, res, next) {
        try {
            const { query, page, page_size } = req.query;
            const data = await serviceService.searchServices(query, parseInt(page), parseInt(page_size));
            res.json(createResponse(true, 'Search results retrieved', data));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ServiceController();
