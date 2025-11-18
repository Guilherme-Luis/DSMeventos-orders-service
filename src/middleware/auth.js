// src/middleware/auth.js
import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;

export default function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Token ausente' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const userId = payload.userId;
        if (!userId) return res.status(401).json({ message: 'Token inválido: userId ausente' });
        req.user = { id: userId };
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido', error: err.message });
    }
}
