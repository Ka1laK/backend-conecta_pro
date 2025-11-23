const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    service_request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest',
        required: true,
        unique: true // One review per request
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    provider_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    highlights: [String],
    comment: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
