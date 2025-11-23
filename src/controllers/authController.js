const authService = require('../services/authService');
const createResponse = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * @desc    Register user
 * @route   POST /auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const {
            full_name,
            email,
            phone_number,
            password,
            account_type,
            accept_terms,
            accept_privacy_policy
        } = req.body;

        if (!phone_number || !password) {
            return next(new AppError('Please provide phone number and password', 400));
        }

        if (accept_terms !== true || accept_privacy_policy !== true) {
            return next(new AppError('You must accept terms and privacy policy', 400));
        }

        const result = await authService.register({
            full_name,
            email,
            phone_number,
            password,
            account_type,
        });

        res.status(201).json(createResponse(true, 'Registro iniciado correctamente.', result));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { phone_number, password } = req.body;

        if (!phone_number || !password) {
            return next(new AppError('Please provide phone number and password', 400));
        }

        const result = await authService.login(phone_number, password);

        res.status(200).json(createResponse(true, 'Inicio de sesión exitoso.', result));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Request phone verification
 * @route   POST /auth/verify-phone/request
 * @access  Public
 */
const requestPhoneVerification = async (req, res, next) => {
    try {
        const { phone_number } = req.body;

        if (!phone_number) {
            return next(new AppError('Please provide phone number', 400));
        }

        const result = await authService.requestPhoneVerification(phone_number);

        res.status(200).json(createResponse(true, 'Se ha enviado un código de verificación por SMS.', result));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Confirm phone verification
 * @route   POST /auth/verify-phone/confirm
 * @access  Public
 */
const confirmPhoneVerification = async (req, res, next) => {
    try {
        const { phone_number, code } = req.body;

        if (!phone_number || !code) {
            return next(new AppError('Please provide phone number and code', 400));
        }

        const result = await authService.confirmPhoneVerification(phone_number, code);

        res.status(200).json(createResponse(true, 'Número de teléfono verificado correctamente.', result));
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { current_password, new_password } = req.body;
        await authService.changePassword(req.user.id, current_password, new_password);
        res.json(createResponse(true, 'Contraseña actualizada correctamente.'));
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;
        await authService.logout(refresh_token);
        res.json(createResponse(true, 'Sesión cerrada correctamente.'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    requestPhoneVerification,
    confirmPhoneVerification,
    changePassword,
    logout,
};
