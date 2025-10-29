const express = require('express');
const { check, validationResult } = require('express-validator');
const { login, signup } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', [
  check('name').notEmpty().withMessage('Name required'),
  check('email').isEmail().withMessage('Valid email required'),
  check('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  check('role').isIn(['District Admin', 'Ward Admin', 'Collector']).withMessage('Invalid role'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
}, signup);

// Login route
router.post('/login', [
  check('email').isEmail().withMessage('Valid email required'),
  check('password').notEmpty().withMessage('Password required'),
  check('role').isIn(['District Admin', 'Ward Admin', 'Collector']).withMessage('Invalid role'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
}, login);

module.exports = router;
