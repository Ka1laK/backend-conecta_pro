const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Update user personal info
 * @param {string} userId
 * @param {object} updateData
 * @returns {object} Updated user data
 */
const updatePersonalInfo = async (userId, updateData) => {
    const { full_name, gender, birth_date } = updateData;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            full_name,
            gender,
            birth_date,
            profile_completed: true,
        },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return {
        user_id: user._id,
        full_name: user.full_name,
        gender: user.gender,
        birth_date: user.birth_date ? user.birth_date.toISOString().split('T')[0] : null,
        profile_completed: user.profile_completed
    };
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    return {
        user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            avatar_url: user.avatar_url || 'https://cdn.serviconecta.com/avatars/default.jpg', // Mock default
            account_type: user.account_type,
            status: {
                phone_verified: user.phone_verified,
                identity_verified: user.identity_verification && user.identity_verification.status === 'verified',
                profile_completed: user.profile_completed
            }
        }
    };
};

const updateProfile = async (userId, updateData) => {
    const { full_name, email, phone_number, avatar_url } = updateData;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            full_name,
            email,
            phone_number,
            avatar_url
        },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return {
        user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            avatar_url: user.avatar_url,
            account_type: user.account_type
        }
    };
};

module.exports = {
    updatePersonalInfo,
    getMe,
    updateProfile,
};
