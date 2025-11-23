const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        next();
    } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
    }
};

module.exports = { protect };
