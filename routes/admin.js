const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET /admin - panel administratora
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin', {
            title: 'Panel Administratora',
            users: users,
            currentUser: req.adminUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

// POST /admin/add-user - dodawanie nowego użytkownika
router.post('/add-user', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Użytkownik o takiej nazwie już istnieje.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isActive: true // admin dodaje aktywnego użytkownika
        });
        await newUser.save();

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Wystąpił błąd podczas dodawania użytkownika.');
    }
});

// GET /admin/toggle-user-rights/:id - przełączanie uprawnień administratora
router.get('/toggle-user-rights/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (userId === req.adminUser.id) {
            return res.status(400).send('Nie możesz zmienić swoich własnych uprawnień.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Użytkownik nie znaleziony.');
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

// GET /admin/delete-user/:id - usuwanie użytkownika
router.get('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (userId === req.adminUser.id) {
            return res.status(400).send('Nie możesz usunąć swojego własnego konta.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Użytkownik nie znaleziony.');
        }

        await User.findByIdAndDelete(userId);

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

module.exports = router;