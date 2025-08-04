const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username })
  if (!user) return done(null, false)
  const match = await bcrypt.compare(password, user.password)
  if (!match) return done(null, false)
  return done(null, user)
}))


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ githubId: profile.id })
  if (!user) {
    user = await User.create({ githubId: profile.id, username: profile.username })
  }
  return done(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})
