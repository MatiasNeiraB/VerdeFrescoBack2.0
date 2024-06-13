const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = {
    authenticateToken
};