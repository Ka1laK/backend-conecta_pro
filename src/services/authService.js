const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Generate Access and Refresh Tokens
 * @param {string} userId
 * @returns {object} tokens
 */
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRE || '1h',
    });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refreshsecret', {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600 // Assuming 1h
    };
};

/**
 * Register a new user
 * @param {object} userData
 * @returns {object} Created user data
 */
const register = async (userData) => {
    const { full_name, email, phone_number, password, account_type } = userData;

    // Check if user exists
    const userExists = await User.findOne({ phone_number });
    if (userExists) {
        throw new AppError('User already exists with this phone number', 400);
    }

    // Create user
    const user = await User.create({
        full_name,
        email,
        phone_number,
        password,
        account_type,
        status: 'unverified',
    });

    const tokens = generateTokens(user._id);

    return {
        user_id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        account_type: user.account_type,
        status: {
            phone_verified: user.phone_verified,
            identity_verified: user.identity_verification.status === 'verified',
            profile_completed: user.profile_completed
        },
        tokens,
    };
};

/**
 * Login user
 * @param {string} phone_number
 * @param {string} password
 * @returns {object} User and tokens
 */
const login = async (phone_number, password) => {
    // Check for user
    const user = await User.findOne({ phone_number }).select('+password');

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    const tokens = generateTokens(user._id);

    return {
        user: {
            id: user._id,
            full_name: user.full_name,
            phone_number: user.phone_number,
            email: user.email,
            account_type: user.account_type,
            status: {
                phone_verified: user.phone_verified,
                identity_verified: user.identity_verification.status === 'verified',
                profile_completed: user.profile_completed
            }
        },
        tokens,
    };
};

/**
 * Request phone verification
 * @param {string} phone_number
 * @returns {object} Masked phone and expiry
 */
const requestPhoneVerification = async (phone_number) => {
    // Mask phone number (e.g., +51 *** *** 250)
    // Simple masking logic: keep first 4 and last 3 chars
    const length = phone_number.length;
    const masked_phone = length > 7
        ? `${phone_number.substring(0, 4)} *** *** ${phone_number.substring(length - 3)}`
        : phone_number;

    return {
        masked_phone,
        expires_in: 300,
        attempts_left: 3
    };
};

/**
 * Confirm phone verification
 * @param {string} phone_number
 * @param {string} code
 * @returns {object} User ID and verification status
 */
const confirmPhoneVerification = async (phone_number, code) => {
    if (code !== '3333') {
        throw new AppError('Invalid verification code', 400);
    }

    const user = await User.findOne({ phone_number });
    if (!user) {
        throw new AppError('User not found', 404);
    }

    user.phone_verified = true;
    user.status = 'active';
    await user.save();

    return {
        user_id: user._id,
        phone_verified: true
    };
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) throw new AppError('Contraseña actual incorrecta', 400);

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return {};
};

const logout = async (refreshToken) => {
    // In a real implementation with refresh tokens stored in DB/Redis, we would invalidate it here.
    // Since we are using stateless JWTs (or not storing refresh tokens in this simple implementation),
    // we just return success.
    return {};
};

module.exports = {
    register,
    login,
    requestPhoneVerification,
    confirmPhoneVerification,
    changePassword,
    logout,
};
