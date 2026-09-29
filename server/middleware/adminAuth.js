const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ensure the token has the admin role
            if (decoded.role !== 'admin') {
                throw new Error('Not authorized as admin');
            }
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, admin token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protectAdmin };