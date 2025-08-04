const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

router.get('/', (req, res) => {
  res.render('home', { user: req.user })
})

router.get('/register', (req, res) => {
  res.render('register')
})


router.get('/login', (req, res) => {
  res.render('login')
})


router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/tasks/dashboard')
)

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/')
  })
})

module.exports = router

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.render('register', { error: 'All fields are required' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('register', { error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.render('login', { success: 'Registration successful. Please log in.' });
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Try again.' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('login', { error: (info && info.message) || 'Login failed' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/tasks/dashboard');
    });
  })(req, res, next);
});

