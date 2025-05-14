
import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req, res, next) => {
    const token = req.cookies?.access_token;
    req.session = { admin: null };
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.session.admin = data;
    } catch { }

    next();
};