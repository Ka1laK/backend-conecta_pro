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
        birth_date: user.birth_date.toISOString().split('T')[0], // Format YYYY-MM-DD
        profile_completed: user.profile_completed
    };
};

module.exports = {
    updatePersonalInfo,
};
