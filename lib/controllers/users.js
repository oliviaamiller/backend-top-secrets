const { Router } = require('express');
//const authenticate = require('../middleware/authenticate');
//const authorize = require('../middleware/authorize');
//const User = require('../models/User');
const UserService = require('../services/UserService');
const DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const token = await UserService.logIn({ email, password });

      res 
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: DAY_IN_MS
        })
        .json({ message: 'Signed in, welcome back!' });
    } catch (error) {
      next(error);
    }
  })

  .delete('/sessions', async (req, res) => {
    res 
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'You have signed out!' });
  });

