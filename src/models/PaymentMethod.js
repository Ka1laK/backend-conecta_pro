const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['CASH', 'CARD_SIMULATED', 'PAYPAL_SIMULATED', 'GOOGLE_PAY_SIMULATED', 'APPLE_PAY_SIMULATED'],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    last4: {
        type: String,
        // Only for cards
    },
    is_default: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function () {
    if (this.is_default) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { is_default: false }
        );
    }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
