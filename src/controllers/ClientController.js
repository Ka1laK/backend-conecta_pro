const clientService = require('../services/ClientService');
const createResponse = require('../utils/response');

class ClientController {
    async getHome(req, res, next) {
        try {
            const { latitude, longitude } = req.query;
            const data = await clientService.getHomeData(req.user.id, latitude, longitude);
            res.json(createResponse(true, 'Home data retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async getLocations(req, res, next) {
        try {
            const locations = await clientService.getLocations(req.user.id);
            res.json(createResponse(true, 'Locations retrieved', { locations }));
        } catch (error) {
            next(error);
        }
    }

    async createLocation(req, res, next) {
        try {
            const location = await clientService.createLocation(req.user.id, req.body);
            res.json(createResponse(true, 'Ubicación guardada correctamente.', location));
        } catch (error) {
            next(error);
        }
    }

    async getPaymentMethods(req, res, next) {
        try {
            const paymentMethods = await clientService.getPaymentMethods(req.user.id);
            res.json(createResponse(true, 'Payment methods retrieved', { payment_methods: paymentMethods }));
        } catch (error) {
            next(error);
        }
    }

    async createPaymentMethod(req, res, next) {
        try {
            const paymentMethod = await clientService.createPaymentMethod(req.user.id, req.body);
            res.json(createResponse(true, 'Método de pago guardado correctamente (simulado).', paymentMethod));
        } catch (error) {
            next(error);
        }
    }

    async createServiceRequest(req, res, next) {
        try {
            const request = await clientService.createServiceRequest(req.user.id, req.body);

            // Format response to match spec exactly
            const responseData = {
                request_id: request._id,
                status: request.status,
                service: {
                    id: request.service._id,
                    title: request.service.title
                },
                provider: {
                    id: request.provider._id,
                    name: request.provider.full_name
                },
                client: {
                    id: request.client._id,
                    name: request.client.full_name
                },
                location: {
                    id: request.location._id,
                    label: request.location.label,
                    full_address: request.location.full_address
                },
                scheduled_date: request.scheduled_date,
                scheduled_time_range: request.scheduled_time_range,
                price_summary: request.price_summary,
                payment: request.payment,
                created_at: request.createdAt
            };

            res.json(createResponse(true, 'Solicitud creada y pago simulado correctamente. Pendiente de confirmación del proveedor.', responseData));
        } catch (error) {
            next(error);
        }
    }

    async getServiceRequests(req, res, next) {
        try {
            const { status, page, page_size } = req.query;
            const data = await clientService.getServiceRequests(req.user.id, status, parseInt(page), parseInt(page_size));
            res.json(createResponse(true, 'Service requests retrieved', data));
        } catch (error) {
            next(error);
        }
    }

    async createReview(req, res, next) {
        try {
            const { requestId } = req.params;
            const review = await clientService.createReview(req.user.id, requestId, req.body);

            const responseData = {
                review_id: review._id,
                request_id: review.service_request,
                service_id: review.service,
                provider_id: review.provider,
                service_rating: review.service_rating,
                provider_rating: review.provider_rating,
                highlights: review.highlights,
                comment: review.comment,
                created_at: review.createdAt
            };

            res.json(createResponse(true, 'Reseña registrada correctamente.', responseData));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClientController();
