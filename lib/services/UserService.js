const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcryptjs.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash
    });

    return user;
  }
};
