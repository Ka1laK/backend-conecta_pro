const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined but unique if present
        trim: true,
        lowercase: true,
    },
    phone_number: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    account_type: {
        type: String,
        enum: ['CLIENTE', 'CONECTA_PRO'],
        default: 'CLIENTE',
    },
    status: {
        type: String,
        enum: ['unverified', 'active', 'suspended'],
        default: 'unverified',
    },
    phone_verified: {
        type: Boolean,
        default: false,
    },
    profile_completed: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    birth_date: {
        type: Date,
    },
    identity_verification: {
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected', 'none'],
            default: 'none',
        },
        checked_at: Date,
        verification_id: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
