const jwt = require('jsonwebtoken');

 function authMiddleware (req, res, next){
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
    } catch (error) {
        console.error('Error verifying the user:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    next();
};

module.exports = authMiddleware;