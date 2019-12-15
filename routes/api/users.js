const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
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
  async (req, res) => {
    // If check fail return error.
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ user_input_errors: err.array() });
    }

    const { name, email, password } = req.body;
    try {
      // See if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get User gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // Encrypt password
      user = new User({ name, email, avatar, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return Json Webtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        // Callback
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error.');
    }
  }
);

module.exports = router;
