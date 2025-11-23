const verificationService = require('../services/verificationService');
const createResponse = require('../utils/response');
const AppError = require('../utils/AppError');

/**
 * @desc    Get identity options
 * @route   GET /verification/identity/options
 * @access  Public
 */
const getIdentityOptions = async (req, res, next) => {
    try {
        const { country } = req.query;
        const result = verificationService.getIdentityOptions(country);
        res.status(200).json(createResponse(true, '', result)); // Message empty as per example? Or maybe just omit
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload identity document
 * @route   POST /verification/identity/document
 * @access  Private
 */
const uploadIdentityDocument = async (req, res, next) => {
    try {
        const { country, document_type, image_base64 } = req.body;

        if (!image_base64 || !document_type) {
            return next(new AppError('Please provide document_type and image_base64', 400));
        }

        const result = await verificationService.uploadIdentityDocument(req.user.id, image_base64, document_type);

        res.status(200).json(createResponse(true, 'Documento recibido para verificación.', result));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get verification status
 * @route   GET /verification/identity/status
 * @access  Private
 */
const getVerificationStatus = async (req, res, next) => {
    try {
        const result = await verificationService.getVerificationStatus(req.user.id);
        res.status(200).json(createResponse(true, '', result));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getIdentityOptions,
    uploadIdentityDocument,
    getVerificationStatus,
};
