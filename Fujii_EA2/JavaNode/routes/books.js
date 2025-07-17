const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const booksFile = path.join(__dirname, '../data/books.json');

function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

function readBooks() {
    if (!fs.existsSync(booksFile)) return [];
    const data = fs.readFileSync(booksFile);
    return JSON.parse(data);
}

router.get('/books', requireLogin, (req, res) => {
    const books = readBooks();
    res.render('books', { books });
});

module.exports = router;
