const ServiceRequest = require('../models/ServiceRequest');
const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');
const Category = require('../models/Category');

class ProviderService {
    async getHomeData(providerId) {
        const provider = await User.findById(providerId);

        // Parallel queries for performance
        const [services, requests, reviews] = await Promise.all([
            Service.find({ provider: providerId }),
            ServiceRequest.find({ provider: providerId }),
            Review.find({ provider: providerId })
        ]);

        const activeServices = services.filter(s => s.status === 'ACTIVE').length;
        const pausedServices = services.filter(s => s.status === 'PAUSED').length;

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.provider_rating, 0) / totalReviews
            : 0;

        // Find next reservation
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // Simple string comparison for date YYYY-MM-DD works for >= today
        // But better to query specifically. For now, filter in memory or use specific query.
        // Let's use specific query for next reservation to be efficient
        const nextReservationRequest = await ServiceRequest.findOne({
            provider: providerId,
            status: { $in: ['ACCEPTED', 'IN_PROGRESS'] },
            scheduled_date: { $gte: todayStr }
        })
            .sort({ scheduled_date: 1, 'scheduled_time_range.start': 1 })
            .populate('service', 'title')
            .populate('client', 'full_name')
            .populate('location', 'full_address label');

        let nextReservation = { exists: false };
        if (nextReservationRequest) {
            nextReservation = {
                exists: true,
                request_id: nextReservationRequest._id,
                service_title: nextReservationRequest.service.title,
                client_name: nextReservationRequest.client.full_name,
                scheduled_date: nextReservationRequest.scheduled_date,
                time_range: nextReservationRequest.scheduled_time_range,
                location: nextReservationRequest.location.full_address
            };
        }

        return {
            provider: {
                id: provider._id,
                name: provider.full_name,
                avatar_url: provider.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg',
                profession: 'Professional' // Mock or derive
            },
            next_reservation: nextReservation,
            services_summary: {
                total_services: services.length,
                active_services: activeServices,
                paused_services: pausedServices
            },
            rating_summary: {
                average_rating: parseFloat(averageRating.toFixed(1)),
                total_reviews: totalReviews
            }
        };
    }

    async getServices(providerId, page = 1, pageSize = 10, status = 'ALL') {
        const query = { provider: providerId };
        if (status && status !== 'ALL') {
            query.status = status;
        }

        const totalItems = await Service.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const services = await Service.find(query)
            .populate('category', 'name')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Calculate pending requests for each service
        // This could be N+1, but for page_size=10 it's acceptable. 
        // Optimization: Aggregate.
        const servicesWithStats = await Promise.all(services.map(async (srv) => {
            const pendingCount = await ServiceRequest.countDocuments({
                service: srv._id,
                status: 'PENDING_PROVIDER_CONFIRMATION'
            });
            return {
                id: srv._id,
                title: srv.title,
                category: {
                    id: srv.category._id,
                    name: srv.category.name
                },
                price: srv.price,
                currency: srv.currency,
                status: srv.status,
                pending_requests_count: pendingCount
            };
        }));

        // Get reservations summary (pending ones)
        const pendingRequests = await ServiceRequest.find({
            provider: providerId,
            status: 'PENDING_PROVIDER_CONFIRMATION'
        })
            .populate('service', 'title')
            .populate('client', 'full_name')
            .limit(5); // Limit to 5 for summary

        const reservationsSummary = pendingRequests.map(r => ({
            request_id: r._id,
            service_title: r.service.title,
            client_name: r.client.full_name,
            scheduled_date: r.scheduled_date,
            time_range: r.scheduled_time_range,
            status: r.status
        }));

        return {
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            services: servicesWithStats,
            reservations_summary: reservationsSummary
        };
    }

    async createService(providerId, data) {
        const { title, description, category_id, price, currency, media } = data;

        // Mock image upload
        const image_url = media && media.image_base64
            ? 'https://cdn.serviconecta.com/services/srv_mock.jpg' // Mock URL
            : 'https://cdn.serviconecta.com/services/default.jpg';

        const service = await Service.create({
            provider: providerId,
            title,
            description,
            category: category_id,
            price,
            currency,
            image_url,
            status: 'ACTIVE'
        });

        const populatedService = await Service.findById(service._id).populate('category', 'name');

        return {
            id: populatedService._id,
            title: populatedService.title,
            description: populatedService.description,
            category: {
                id: populatedService.category._id,
                name: populatedService.category.name
            },
            price: populatedService.price,
            currency: populatedService.currency,
            status: populatedService.status,
            image_url: populatedService.image_url
        };
    }

    async updateService(providerId, serviceId, data) {
        const service = await Service.findOne({ _id: serviceId, provider: providerId });
        if (!service) throw new Error('Service not found or not authorized');

        if (data.title) service.title = data.title;
        if (data.description) service.description = data.description;
        if (data.price) service.price = data.price;
        if (data.status) service.status = data.status;

        await service.save();
        await service.populate('category', 'name');

        return {
            id: service._id,
            title: service.title,
            description: service.description,
            category: {
                id: service.category._id,
                name: service.category.name
            },
            price: service.price,
            currency: service.currency,
            status: service.status
        };
    }

    async getServiceDetails(providerId, serviceId) {
        const service = await Service.findOne({ _id: serviceId, provider: providerId }).populate('category', 'name');
        if (!service) throw new Error('Service not found or not authorized');

        // Recent requests
        const recentRequests = await ServiceRequest.find({ service: serviceId })
            .populate('client', 'full_name')
            .populate('location', 'full_address label') // Assuming location has label/address
            .sort({ createdAt: -1 })
            .limit(5);

        const formattedRequests = recentRequests.map(r => ({
            request_id: r._id,
            client_name: r.client.full_name,
            location: r.location.full_address, // Simplify
            scheduled_date: r.scheduled_date,
            time_range: r.scheduled_time_range,
            status: r.status
        }));

        // Reviews summary
        const reviews = await Review.find({ service: serviceId }).populate('author', 'full_name');
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.service_rating, 0) / totalReviews
            : 0;

        return {
            service: {
                id: service._id,
                title: service.title,
                description: service.description,
                category: {
                    id: service.category._id,
                    name: service.category.name
                },
                price: service.price,
                currency: service.currency,
                status: service.status,
                image_url: service.image_url
            },
            recent_requests: formattedRequests,
            reviews_summary: {
                average_rating: parseFloat(averageRating.toFixed(1)),
                total_reviews: totalReviews,
                last_reviews: reviews.slice(0, 5).map(r => ({
                    author_name: r.author.full_name,
                    rating: r.service_rating,
                    comment: r.comment,
                    created_at: r.createdAt
                }))
            }
        };
    }

    async getServiceRequests(providerId, status, page = 1, pageSize = 10) {
        const query = { provider: providerId };
        if (status) {
            query.status = status;
        }

        const totalItems = await ServiceRequest.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const requests = await ServiceRequest.find(query)
            .populate('client', 'full_name avatar_url')
            .populate('service', 'title')
            .populate('location', 'full_address label')
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const formattedRequests = requests.map(r => ({
        request_id: r._id.toString(),

        client: {
            id: r.client?._id?.toString() || null,
            name: r.client?.full_name || null
        },

        service: {
            id: r.service?._id?.toString() || null,
            title: r.service?.title || null
        },

        scheduled_date: r.scheduled_date,
        
        scheduled_time_range: {
            start: r.scheduled_time_range?.start || null,
            end: r.scheduled_time_range?.end || null
        },

        price_summary: {
            currency: r.service?.currency || "PEN", // fallback
            total: r.service?.price || 0
        },

        status: r.status
        }));

        return {
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            requests: formattedRequests
        };
    }

    async getServiceRequestDetails(providerId, requestId) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId })
            .populate('service', 'title')
            .populate('client', 'full_name avatar_url')
            .populate('location', 'full_address label');

        if (!request) throw new Error('Service request not found');

        return {
            request_id: request._id,
            service: {
                id: request.service._id,
                title: request.service.title
            },
            client: {
                id: request.client._id,
                name: request.client.full_name,
                avatar_url: request.client.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg'
            },
            location: request.location.full_address,
            scheduled_date: request.scheduled_date,
            time_range: request.scheduled_time_range,
            payment_method: 'Efectivo', // Mock or derive from payment_method_id
            status: request.status
        };
    }

    async acceptRequest(providerId, requestId, notes) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId });
        if (!request) throw new Error('Service request not found');
        if (request.status !== 'PENDING_PROVIDER_CONFIRMATION') throw new Error('Cannot accept request');

        request.status = 'ACCEPTED';
        if (notes) request.notes = (request.notes || '') + '\n' + notes;
        await request.save();
        return { request_id: request._id, status: request.status };
    }

    async rejectRequest(providerId, requestId, reason) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId });
        if (!request) throw new Error('Service request not found');
        if (request.status !== 'PENDING_PROVIDER_CONFIRMATION') throw new Error('Cannot reject request');

        request.status = 'REJECTED';
        request.rejection_reason = reason;
        await request.save();
        return { request_id: request._id, status: request.status };
    }

    async cancelRequest(providerId, requestId, reason) {
        const request = await ServiceRequest.findOne({ _id: requestId, provider: providerId });
        if (!request) throw new Error('Service request not found');

        if (['COMPLETED', 'CANCELLED', 'CANCELLED_BY_PROVIDER', 'REJECTED'].includes(request.status)) {
            throw new Error('Cannot cancel request in current status');
        }

        request.status = 'CANCELLED_BY_PROVIDER';
        request.rejection_reason = reason; // Reuse field or add cancellation_reason
        await request.save();
        return { request_id: request._id, status: request.status };
    }

    async getReviews(providerId, page = 1, pageSize = 10, ratingFilter = null, sort = 'MOST_RECENT') {
        const query = { provider: providerId };
        if (ratingFilter) {
            query.provider_rating = ratingFilter; // Or service_rating? Spec says "rating_filter". Let's assume provider_rating or overall.
        }

        const sortOptions = {};
        if (sort === 'MOST_RECENT') sortOptions.createdAt = -1;
        else if (sort === 'HIGHEST_RATING') sortOptions.provider_rating = -1;
        else if (sort === 'LOWEST_RATING') sortOptions.provider_rating = 1;

        const totalItems = await Review.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const reviews = await Review.find(query)
            .populate('service', 'title')
            .populate('author', 'full_name avatar_url') // author is client
            .sort(sortOptions)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Calculate distribution
        const allReviews = await Review.find({ provider: providerId });
        const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        let sumRating = 0;
        allReviews.forEach(r => {
            const rating = Math.round(r.provider_rating); // Ensure integer key
            if (distribution[rating] !== undefined) distribution[rating]++;
            sumRating += r.provider_rating;
        });
        const averageRating = allReviews.length > 0 ? sumRating / allReviews.length : 0;

        return {
            summary: {
                average_rating: parseFloat(averageRating.toFixed(1)),
                total_reviews: allReviews.length,
                distribution
            },
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            reviews: reviews.map(r => ({
                review_id: r._id,
                created_at: r.createdAt,
                rating: r.provider_rating,
                service: {
                    id: r.service._id,
                    title: r.service.title
                },
                client: {
                    id: r.author._id,
                    name: r.author.full_name,
                    avatar_url: r.author.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg'
                },
                comment: r.comment
            }))
        };
    }
}

module.exports = new ProviderService();
