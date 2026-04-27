const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number },
    isbn: { type: String },
    description: { type: String },
    pages: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);