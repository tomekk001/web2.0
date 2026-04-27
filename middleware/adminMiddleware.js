const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user && user.isAdmin === true) {
            req.adminUser = user;
            next();
        } else {
            res.status(403).send('Odmowa dostępu: Wymagane uprawnienia administratora.');
        }
    } catch (err) {
        res.status(500).send('Błąd serwera podczas weryfikacji uprawnień.');
    }
};

module.exports = adminMiddleware;