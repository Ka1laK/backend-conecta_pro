const User = require('../models/User');

/**
 * Get identity options
 * @param {string} country
 * @returns {object} Country and document types
 */
const getIdentityOptions = (country) => {
    // Mock logic based on country
    // Default to PE structure if country is PE or generic
    const document_types = [
        {
            code: "NATIONAL_ID",
            label: "Documento de identidad"
        },
        {
            code: "PASSPORT",
            label: "Pasaporte"
        },
        {
            code: "DRIVER_LICENSE",
            label: "Licencia de conducir"
        }
    ];

    return {
        country: country || 'PE',
        document_types
    };
};

/**
 * Upload identity document
 * @param {string} userId
 * @param {string} documentBase64
 * @param {string} documentType
 * @returns {object} Verification status
 */
const uploadIdentityDocument = async (userId, documentBase64, documentType) => {
    // Simulate upload and verification process
    const verificationId = `ver_${Math.random().toString(36).substring(2, 11)}`;

    const user = await User.findById(userId);
    if (user) {
        user.identity_verification = {
            status: 'verified',
            checked_at: new Date(),
            verification_id: verificationId
        };
        await user.save();
    }

    return {
        verification_id: verificationId,
        status: 'VERIFIED'
    };
};

/**
 * Get verification status
 * @param {string} userId
 * @returns {object} Status
 */
const getVerificationStatus = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { status: 'none', checked_at: null };
    }

    return {
        user_id: user._id,
        status: user.identity_verification.status.toUpperCase(),
        checked_at: user.identity_verification.checked_at
    };
};

module.exports = {
    getIdentityOptions,
    uploadIdentityDocument,
    getVerificationStatus
};
