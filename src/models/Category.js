const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true
    },
    icon_url: {
        type: String,
        required: [true, 'Icon URL is required']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
