const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const admin = 'ADMINISTRADOR';
dotenv.config();


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Acceso denegado. Token no válido.' });
        }
        req.user = user;
        next();
    });
};




const AuthRole = (req, res, next) => {
    req.user = user;
    if (req.user.role !== admin) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
    }
    next();
}





module.exports = {
    authenticateToken,
    AuthRole
};