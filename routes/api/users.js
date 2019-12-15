const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email!').isEmail,
    check(
      'password',
      'Please enter a password with at least 6 characters!'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    // If check fail return error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    console.log(req.body);
    res.send('User route');
  }
);

module.exports = router;