const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.get('/', (req, res) => res.send('api/users Running'));

router.post(
  '/',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email!').isEmail(),
    check(
      'password',
      'Please enter a password with at least 6 characters!'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    // If check fail return error.
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ user_input_errors: err.array() });
    }
    console.log(req.body);
    res.send('User route (Input Valid');
  }
);

module.exports = router;
