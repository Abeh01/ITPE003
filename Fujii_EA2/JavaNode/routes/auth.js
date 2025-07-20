const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to users.json
const usersFile = path.join(__dirname, '../data/users.json');

// Helper functions
function readUsers() {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.send('User already exists. Try a different username.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    writeUsers(users);

    res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.render('login', { error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render('login', { error: 'Incorrect password' });
    }

    req.session.user = { username: user.username };
    res.redirect('/books');
});


// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
