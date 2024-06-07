const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('User not Authorized');
    }

    const token = req.headers.authorization.split(' ')[1];
    const result = jwt.verify(token, 'mysecurepassword');

    if (result) {
      req.user = result.id;
      next();
    } else {
      throw new Error('Invalid Token');
    }
  } catch (error) {
    res.status(401).json({ message: error.message || 'User not Authorized' });
  }
};

module.exports = verifyToken;
