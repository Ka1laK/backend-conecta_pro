const providerService = require('../services/ProviderService');
const createResponse = require('../utils/response');

class ProviderController {
    async getServiceRequests(req, res, next) {
        try {
            const { status } = req.query;
            const requests = await providerService.getServiceRequests(req.user.id, status);
            res.json(createResponse(true, 'Provider requests retrieved', { requests }));
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
}

module.exports = new ProviderController();
