// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Pass user session to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');
app.use(authRoutes);
app.use(bookRoutes);
app.use(cartRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('home');
});


// Start server
app.listen(PORT, () => {
    console.log(`📚 Bookstore running at http://localhost:${PORT}`);
});
