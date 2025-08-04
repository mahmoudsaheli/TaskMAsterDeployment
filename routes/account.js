const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/delete', async (req, res) => {
  try {
    if (!req.user) return res.redirect('/login');

    await User.findByIdAndDelete(req.user._id);
    req.logout(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
