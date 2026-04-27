require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const cookieParser = require('cookie-parser');

const adminMiddleware = require('./middleware/adminMiddleware');
const { verifyToken, optionalVerifyToken } = require('./middleware/authMiddleware');

const app = express();

app.use(cookieParser());
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/web2_db')
  .then(() => console.log('Połączono z bazą MongoDB'))
  .catch(err => console.error('Błąd połączenia z bazą', err));

app.use(optionalVerifyToken);

app.use(async (req, res, next) => {
    if (req.user) {
        try {
            const User = require('./models/User');
            res.locals.user = await User.findById(req.user.id);
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

app.use('/api', apiRoutes);       
app.use('/auth', authRoutes);
app.use('/books', booksRoutes); 
app.use('/admin', verifyToken, adminMiddleware, adminRoutes);

app.get('/', (req, res) => {
    res.render('index', { title: 'Strona Główna' });
});

app.get('/change-password', (req, res) => {
    res.render('change-password', { title: 'Zmiana Hasła' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));