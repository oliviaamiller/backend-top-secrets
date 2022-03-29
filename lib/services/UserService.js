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

  static async logIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if(!user) throw new Error('Invalid login');
      if(!bcryptjs.compareSync(password, user.passwordHash))
        throw new Error('Invalid login');
        
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
        
      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
