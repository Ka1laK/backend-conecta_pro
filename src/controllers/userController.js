const userService = require('../services/userService');
const createResponse = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * @desc    Update personal info
 * @route   PATCH /users/me/personal-info
 * @access  Private
 */
const updatePersonalInfo = async (req, res, next) => {
    try {
        const { full_name, gender, birth_date } = req.body;

        if (!full_name || !gender || !birth_date) {
            return next(new AppError('Please provide full_name, gender, and birth_date', 400));
        }

        const result = await userService.updatePersonalInfo(req.user.id, {
            full_name,
            gender,
            birth_date,
        });

        res.status(200).json(createResponse(true, 'Información personal actualizada correctamente.', result));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updatePersonalInfo,
};
