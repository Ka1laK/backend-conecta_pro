const ServiceRequest = require('../models/ServiceRequest');

class ProviderService {
    async getServiceRequests(providerId, status) {
        const query = { provider: providerId };
        if (status) {
            query.status = status;
        }

        const requests = await ServiceRequest.find(query)
            .populate('client', 'full_name')
            .populate('service', 'title')
            .sort({ createdAt: -1 });

        return requests.map(r => ({
            request_id: r._id,
            client: {
                id: r.client._id,
                name: r.client.full_name
            },
            service: {
                id: r.service._id,
                title: r.service.title
            },
            scheduled_date: r.scheduled_date,
            scheduled_time_range: r.scheduled_time_range,
            price_summary: {
                currency: r.price_summary.currency,
                total: r.price_summary.total
            },
            status: r.status
        }));
    }

    async acceptRequest(providerId, requestId, notes) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId });
        if (!request) throw new Error('Service request not found or not authorized');

        if (request.status !== 'PENDING_PROVIDER_CONFIRMATION') {
            throw new Error('Request cannot be accepted in current status');
        }

        request.status = 'ACCEPTED';
        // Optionally save notes if we had a field for provider notes, but spec just says input notes.
        // We can append to existing notes or ignore if no field.
        // Let's assume we might want to log it or append.
        if (notes) {
            request.notes = (request.notes ? request.notes + '\nProvider Note: ' : 'Provider Note: ') + notes;
        }

        await request.save();

        return {
            request_id: request._id,
            status: request.status
        };
    }

    async rejectRequest(providerId, requestId, reason) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId });
        if (!request) throw new Error('Service request not found or not authorized');

        if (request.status !== 'PENDING_PROVIDER_CONFIRMATION') {
            throw new Error('Request cannot be rejected in current status');
        }

        request.status = 'REJECTED';
        request.rejection_reason = reason;
        await request.save();

        return {
            request_id: request._id,
            status: request.status
        };
    }
}

module.exports = new ProviderService();
