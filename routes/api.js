const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/authMiddleware');

// Wszystkie endpointy API zabezpieczone tokenem JWT (zadanie 3)
router.use(verifyToken);

// GET /api/books – pobierz wszystkie książki
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// GET /api/books/:id – pobierz jedną książkę
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Nie znaleziono książki' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// POST /api/books – dodaj książkę
router.post('/books', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        const book = new Book({ title, author, year });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ error: 'Błąd podczas tworzenia książki' });
    }
});

// PUT /api/books/:id – zaktualizuj książkę
router.put('/books/:id', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, year },
            { new: true, runValidators: true }
        );
        if (!book) return res.status(404).json({ error: 'Nie znaleziono książki' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: 'Błąd podczas aktualizacji' });
    }
});

// DELETE /api/books/:id – usuń książkę
router.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: 'Nie znaleziono książki' });
        res.json({ message: 'Książka została usunięta', book });
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;