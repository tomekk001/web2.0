const jwt = require('jsonwebtoken');

const optionalVerifyToken = (req, res, next) => {
    // Pobieramy token z ciasteczka LUB z nagłówka Authorization
    const token = req.cookies.token || (req.header('Authorization') ? req.header('Authorization').split(' ')[1] : null);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_sekretny_klucz');
        req.user = verified;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || (req.header('Authorization') ? req.header('Authorization').split(' ')[1] : null);

    if (!token) {
        return res.status(401).json({ error: "Odmowa dostępu - zaloguj się" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_sekretny_klucz');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Nieprawidłowy token" });
    }
};

module.exports = { verifyToken, optionalVerifyToken };