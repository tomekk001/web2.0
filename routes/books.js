const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają zalogowania
router.use(verifyToken);

// GET /books - wyświetl wszystkie książki
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.render('books/list', {
            title: 'Biblioteka - Lista Książek',
            books: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

// GET /books/new - formularz dodawania nowej książki
router.get('/new', (req, res) => {
    res.render('books/form', {
        title: 'Dodaj nową książkę',
        book: {},
        isNew: true
    });
});

// POST /books - dodaj nową książkę
router.post('/', async (req, res) => {
    try {
        const { title, author, year, isbn, description, pages } = req.body;
        const book = new Book({
            title,
            author,
            year: year ? parseInt(year) : null,
            isbn,
            description,
            pages: pages ? parseInt(pages) : null
        });
        await book.save();
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(400).render('books/form', {
            title: 'Dodaj nową książkę',
            book: req.body,
            isNew: true,
            error: 'Błąd podczas dodawania książki. Upewnij się, że tytuł i autor są wypełnione.'
        });
    }
});

// GET /books/:id/edit - formularz edytowania książki
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Nie znaleziono książki');
        }
        res.render('books/form', {
            title: 'Edytuj książkę',
            book: book,
            isNew: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

// PUT /books/:id - aktualizuj książkę
router.post('/:id', async (req, res) => {
    try {
        const { title, author, year, isbn, description, pages } = req.body;
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title,
                author,
                year: year ? parseInt(year) : null,
                isbn,
                description,
                pages: pages ? parseInt(pages) : null
            },
            { new: true, runValidators: true }
        );
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        const book = await Book.findById(req.params.id);
        res.status(400).render('books/form', {
            title: 'Edytuj książkę',
            book: book,
            isNew: false,
            error: 'Błąd podczas edytowania książki.'
        });
    }
});

// DELETE /books/:id - usuń książkę
router.get('/:id/delete', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

// GET /books/:id - wyświetl szczegóły książki
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Nie znaleziono książki');
        }
        res.render('books/detail', {
            title: book.title,
            book: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
    }
});

module.exports = router;
