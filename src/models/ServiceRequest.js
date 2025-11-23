const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING_PROVIDER_CONFIRMATION', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CANCELLED_BY_PROVIDER'],
        default: 'PENDING_PROVIDER_CONFIRMATION'
    },
    scheduled_date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    scheduled_time_range: {
        start: { type: String, required: true }, // HH:mm
        end: { type: String, required: true }   // HH:mm
    },
    price_summary: {
        currency: { type: String, default: 'PEN' },
        subtotal: Number,
        discount: Number,
        total: Number
    },
    payment: {
        payment_method_id: { type: String }, // Can be ID or "pm_cash"
        mode: { type: String, default: 'SIMULATED' },
        status: { type: String, default: 'SIMULATED_PAID' }
    },
    notes: String,
    rejection_reason: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
