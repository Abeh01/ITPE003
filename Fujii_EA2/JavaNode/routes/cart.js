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

router.get('/cart', requireLogin, (req, res) => {
    const cart = req.session.cart || [];
    const books = readBooks();

    const items = cart.map(item => {
        // Use non-strict comparison just in case
        const book = books.find(b => b.id == item.bookId);

        if (!book) {
            console.log(`❌ Book ID ${item.bookId} not found in books.json`);
            return null; // skip this item if book not found
        }

        return {
            ...item,
            title: book.title,
            author: book.author,
            price: book.price,
            image: book.image,
            total: book.price * item.quantity
        };
    }).filter(item => item !== null); // remove any nulls

    console.log('🧾 Cart items to render:', items); // 🔍 Debug final render list

    res.render('cart', { items });
});


router.post('/cart/add', (req, res) => {
    const { bookId, quantity } = req.body;
    console.log('📥 Add to cart:', { bookId, quantity });
    console.log('🛒 Cart before:', req.session.cart);
    if (!req.session.cart) req.session.cart = [];

    const existing = req.session.cart.find(item => item.bookId == bookId);
    if (existing) {
        existing.quantity += parseInt(quantity);
    } else {
        req.session.cart.push({
            bookId: parseInt(bookId),
            quantity: parseInt(quantity)
        });
    }

    res.redirect('/cart');
});


router.post('/cart/delete', (req, res) => {
    const { bookId } = req.body;

    if (!req.session.cart) return res.redirect('/cart');

    req.session.cart = req.session.cart.filter(item => item.bookId != bookId);

    res.redirect('/cart');
});

router.post('/cart/checkout', (req, res) => {
    // You could log the order here or save to a file if needed
    req.session.cart = []; // Clear the cart

    // Optional: set flash message in session if using it
    res.render('checkout-success'); // or redirect to /cart with a success message
});

module.exports = router;
