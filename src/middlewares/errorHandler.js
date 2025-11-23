const createResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error for debugging (in production use a logger)
    console.error('ERROR 💥', err);

    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json(
            createResponse(false, err.message, null, err.errors)
        );
    }

    // Programming or other unknown error: don't leak error details
    return res.status(500).json(
        createResponse(false, 'Something went wrong!', null, [err.message])
    );
};

module.exports = errorHandler;
