const express = require ('express');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require ('../models/user');
const {body, validationResult} = require ('express-validator');
const router = express.Router ();

router.post (
  '/register',
  [
    body ('username').notEmpty ().withMessage ('Username is required'),
    body ('email').isEmail ().withMessage ('Valid email is required'),
    body ('password')
      .isLength ({min: 6})
      .withMessage ('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    try {
      const {username, email, password} = req.body;
      const hashPassword = await bcrypt.hash (password, 10);
      const newUser = new User ({username, email, password: hashPassword});
      await newUser.save ();

      res.status (201).json (newUser);
    } catch (error) {
      res.status (500).json ({message: error.message});
    }
  }
);

router.post (
  '/login',
  [
    body ('email').isEmail ().withMessage ('Valid email is required'),
    body ('password').notEmpty ().withMessage ('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    try {
      const {email, password} = req.body;
      const user = await User.findOne ({email});
      if (!user) {
        return res.status (404).json ({message: 'User not found'});
      }

      const isMatch = await bcrypt.compare (password, user.password);
      if (!isMatch) {
        return res.status (400).json ({message: 'Invalid credentials'});
      }

      const token = jwt.sign ({id: user._id}, process.env.SECRET_KEY, {
        expiresIn: '2h',
      });

      res.status (200).json ({token});
    } catch (error) {
      res.status (500).json ({message: error.message});
    }
  }
);

module.exports = router;
