const user_model = require('../models/user_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async(req, res) => {
  try {
    console.log(req.body)
    const hashPassword = await bcrypt.hash(req.body.password,10);
    const user = await user_model.create({...req.body , password : hashPassword})
    res.json({user, status: true}) 
  } 
  catch (error) {
    res.json({status: false, message : error.message})
  }
    }

    exports.signin = async (req, res) => {
      const loginIdentifier = req.body.loginIdentifier;
      const password = req.body.password;
  
      try {
          let user = await user_model.findOne({ email: loginIdentifier });
  
          if (!user) {
              user = await user_model.findOne({ username: loginIdentifier });
          }
  
          if (!user) {
              return res.status(301).json({ message: 'Username or Email doesn\'t Exist!' });
          }
  
          const verify = await bcrypt.compare(password, user.password);
          if (verify) {
              const token = jwt.sign({ id: user._id }, 'mysecurepassword');
              res.json({
                  token,
                  user: {
                      username: user.username,
                      email: user.email
                  }
              });
          } else {
              // Password doesn't match for both email and username
              return res.status(204).json({ message: 'Invalid Password for provided Email or Username' });
          }
      } catch (error) {
          console.error('Error during login:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  };  

exports.checkUnique = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ status: false, message: "Invalid email address" });
    }

    // Check if username and email are unique
    const existingUser = await user_model.findOne({
      $or: [
        { username: username },
        { email: email },
      ],
    });

    if (existingUser) {
      return res.json({ status: false, message: "Username or email already exists" });
    } else {
      return res.json({ status: true, message: "Username and email are unique" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};