const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => res.render('register'))
router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10)
  await User.create({ username: req.body.username, password: hashed })
  res.redirect('/login')
})


router.get('/login', (req, res) => res.render('login'))
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}))


router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
)

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/')
  })
})

module.exports = router
