const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendActivationEmail } = require('../utils/mailer');

// --- REJESTRACJA ---
router.get('/register', (req, res) => {
    res.render('register', { title: 'Rejestracja' });
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('Użytkownik o takiej nazwie lub adresie e-mail już istnieje.');
        }

        // generowanie tokenu
        const activationToken = crypto.randomBytes(32).toString('hex');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            isActive: false, // konto nieaktywne do czasu kliknięcia linku
            activationToken,
        });
        await newUser.save();

        // link aktywacyjny
        const activationLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/activate/${activationToken}`;

        // wysyłnie e-mail
        await sendActivationEmail(email, activationLink);

        res.render('info', {
            title: 'Sprawdź swoją skrzynkę',
            message: `Na adres ${email} wysłaliśmy link aktywacyjny. Sprawdź pocztę i kliknij w link, aby aktywować konto.`,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Wystąpił błąd podczas rejestracji.');
    }
});

// --- LOGOWANIE ---
router.get('/login', (req, res) => {
    res.render('login', { title: 'Logowanie' });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło.');
        }

        if (!user.isActive) {
            return res.status(403).send('Konto nie zostało jeszcze aktywowane. Sprawdź swoją skrzynkę e-mail i kliknij link aktywacyjny.');
        }
        
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET || 'super_sekretny_klucz', 
            { expiresIn: '1h' }
        );
        
        // Zapisujemy ciasteczko
        res.cookie('token', token, { httpOnly: true });

        // JSON z tokenem dla AJAX
        res.json({ 
            message: 'Zalogowano pomyślnie!', 
            token: token
           });

    } catch (err) {
        return res.status(500).send('Wystąpił błąd podczas logowania.');
    }
});

// --- WYLOGOWANIE ---
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

// --- AKTYWACJA KONTA ---
router.get('/activate/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ activationToken: token });

        if (!user) {
            return res.status(400).render('info', {
                title: 'Błąd aktywacji',
                message: 'Link aktywacyjny jest nieprawidłowy lub już został użyty.',
            });
        }

        // aktywacja konta i usunięcie tokenu
        user.isActive = true;
        user.activationToken = null;
        await user.save();

        res.render('info', {
            title: 'Konto aktywowane!',
            message: 'Twoje konto zostało pomyślnie aktywowane. Możesz się teraz zalogować.',
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Wystąpił błąd podczas aktywacji.');
    }
});

// --- ZMIANA HASŁA ---
router.get('/change-password', verifyToken, (req, res) => {
    res.render('change-password', { title: 'Zmiana hasła' });
});

router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).send('Błąd: Wprowadzone hasła nie są identyczne.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        return res.send('Hasło zostało pomyślnie zmienione! <a href="/">Wróć do strony głównej</a>');
    } catch (err) {
        return res.status(500).send('Wystąpił błąd podczas zmiany hasła.');
    }
});

module.exports = router;