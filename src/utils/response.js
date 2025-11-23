/**
 * Standard API Response Wrapper
 * @param {boolean} success - Request success status
 * @param {string} message - Human readable message
 * @param {object} data - Payload data
 * @param {array} errors - List of errors
 * @returns {object} Standardized JSON response
 */
const createResponse = (success, message, data = null, errors = []) => {
    return {
        success,
        message,
        data,
        errors
    };
};

module.exports = createResponse;
