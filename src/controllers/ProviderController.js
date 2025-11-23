const providerService = require('../services/ProviderService');
const createResponse = require('../utils/response');

class ProviderController {
    async getHome(req, res, next) {
        try {
            const data = await providerService.getHomeData(req.user.id);
            res.json(createResponse(true, 'Home data retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getServices(req, res, next) {
        try {
            const { page, page_size, status } = req.query;
            const data = await providerService.getServices(req.user.id, parseInt(page), parseInt(page_size), status);
            res.json(createResponse(true, 'Services retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async createService(req, res, next) {
        try {
            const data = await providerService.createService(req.user.id, req.body);
            res.json(createResponse(true, 'Servicio creado correctamente.', data));
        } catch (error) {
            next(error);
        }
    }

    async updateService(req, res, next) {
        try {
            const { serviceId } = req.params;
            const data = await providerService.updateService(req.user.id, serviceId, req.body);
            res.json(createResponse(true, 'Servicio actualizado correctamente.', data));
        } catch (error) {
            next(error);
        }
    }

    async getServiceDetails(req, res, next) {
        try {
            const { serviceId } = req.params;
            const data = await providerService.getServiceDetails(req.user.id, serviceId);
            res.json(createResponse(true, 'Service details retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getServiceRequests(req, res, next) {
        try {
            const { status, page, page_size } = req.query;
            const data = await providerService.getServiceRequests(
                req.user.id,
                status,
                parseInt(page) || 1,
                parseInt(page_size) || 10
            );
            res.json(createResponse(true, 'Provider requests retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getServiceRequestDetails(req, res, next) {
        try {
            const { requestId } = req.params;
            const data = await providerService.getServiceRequestDetails(req.user.id, requestId);
            res.json(createResponse(true, 'Request details retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async acceptRequest(req, res, next) {
        try {
            const { requestId } = req.params;
            const { notes } = req.body;
            const data = await providerService.acceptRequest(req.user.id, requestId, notes);
            res.json(createResponse(true, 'Solicitud aceptada.', data));
        } catch (error) {
            next(error);
        }
    }

    async rejectRequest(req, res, next) {
        try {
            const { requestId } = req.params;
            const { reason } = req.body;
            const data = await providerService.rejectRequest(req.user.id, requestId, reason);
            res.json(createResponse(true, 'Solicitud rechazada.', data));
        } catch (error) {
            next(error);
        }
    }

    async cancelRequest(req, res, next) {
        try {
            const { requestId } = req.params;
            const { reason } = req.body;
            const data = await providerService.cancelRequest(req.user.id, requestId, reason);
            res.json(createResponse(true, 'Reserva cancelada por el proveedor.', data));
        } catch (error) {
            next(error);
        }
    }

    async getReviews(req, res, next) {
        try {
            const { page, page_size, rating_filter, sort } = req.query;
            const data = await providerService.getReviews(req.user.id, parseInt(page), parseInt(page_size), rating_filter, sort);
            res.json(createResponse(true, 'Reviews retrieved', data));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProviderController();
