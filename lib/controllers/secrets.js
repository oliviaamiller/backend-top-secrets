const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');



module.exports = Router()

  .post('/', authenticate, async (req, res, next) => {
    try{
      const secrets = await Secret.insert();
      res.send(secrets);
    } catch (error) {
      next(error);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const secrets = await Secret.getAll();
      res.send(secrets);
    } catch (error) {
      next(error);
    }

  });
