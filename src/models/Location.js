const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    label: {
        type: String,
        required: [true, 'Label is required'], // e.g., "Casa", "Trabajo"
        trim: true
    },
    full_address: {
        type: String,
        required: [true, 'Full address is required']
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    is_default: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one default location per user
locationSchema.pre('save', async function () {
    if (this.is_default) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { is_default: false }
        );
    }
});

module.exports = mongoose.model('Location', locationSchema);
