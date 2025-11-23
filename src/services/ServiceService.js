const Service = require('../models/Service');
const Category = require('../models/Category');
const Review = require('../models/Review');

class ServiceService {
    async getServicesByCategory(categoryId, page = 1, pageSize = 10, search = '') {
        const query = { category: categoryId };
        if (search) {
            query.$text = { $search: search };
        }

        const totalItems = await Service.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const services = await Service.find(query)
            .populate('provider', 'full_name account_type avatar_url')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const category = await Category.findById(categoryId);

        return {
            category: {
                id: category._id,
                name: category.name
            },
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            services: services.map(srv => ({
                id: srv._id,
                title: srv.title,
                price: srv.price,
                currency: srv.currency,
                rating: srv.rating,
                reviews_count: srv.reviews_count,
                image_url: srv.image_url,
                provider: {
                    id: srv.provider._id,
                    name: srv.provider.full_name,
                    profession: 'Técnico', // Mock
                    avatar_url: srv.provider.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg'
                }
            }))
        };
    }

    async getTopServices(page = 1, pageSize = 10) {
        const query = {}; // Add criteria for "top" if needed, e.g. rating > 4

        const totalItems = await Service.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const services = await Service.find(query)
            .sort({ rating: -1, reviews_count: -1 })
            .populate('provider', 'full_name account_type avatar_url')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            services: services.map(srv => ({
                id: srv._id,
                title: srv.title,
                price: srv.price,
                currency: srv.currency,
                rating: srv.rating,
                reviews_count: srv.reviews_count,
                image_url: srv.image_url,
                provider: {
                    id: srv.provider._id,
                    name: srv.provider.full_name,
                    profession: 'Técnico', // Mock
                    avatar_url: srv.provider.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg'
                }
            }))
        };
    }

    async getServiceDetails(serviceId) {
        const service = await Service.findById(serviceId)
            .populate('category', 'name')
            .populate('provider', 'full_name account_type avatar_url');

        if (!service) throw new Error('Service not found');

        const reviews = await Review.find({ service: serviceId })
            .populate('author', 'full_name')
            .sort({ createdAt: -1 })
            .limit(5); // Show recent 5 reviews

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
            rating: service.rating,
            reviews_count: service.reviews_count,
            image_url: service.image_url,
            provider: {
                id: service.provider._id,
                name: service.provider.full_name,
                profession: 'Técnico', // Mock
                avatar_url: service.provider.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg',
                years_experience: 5 // Mock
            },
            comments: reviews.map(r => ({
                id: r._id,
                author_name: r.author.full_name,
                rating: r.service_rating, // or average of service/provider rating? Spec says "rating"
                comment: r.comment,
                created_at: r.createdAt
            }))
        };
    }

    async searchServices(queryText, page = 1, pageSize = 10) {
        const query = { $text: { $search: queryText } };

        const totalItems = await Service.countDocuments(query);
        const totalPages = Math.ceil(totalItems / pageSize);

        const services = await Service.find(query)
            .populate('provider', 'full_name account_type avatar_url')
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            query: queryText,
            pagination: {
                page,
                page_size: pageSize,
                total_items: totalItems,
                total_pages: totalPages
            },
            services: services.map(srv => ({
                id: srv._id,
                title: srv.title,
                price: srv.price,
                currency: srv.currency,
                rating: srv.rating,
                reviews_count: srv.reviews_count,
                image_url: srv.image_url,
                provider: {
                    id: srv.provider._id,
                    name: srv.provider.full_name,
                    profession: 'Técnico', // Mock
                    avatar_url: srv.provider.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg'
                }
            }))
        };
    }
}

module.exports = new ServiceService();
