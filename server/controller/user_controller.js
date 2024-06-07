const router = require('express').Router();
const User = require('../models/user_model');
const verifyToken = require('../middleware/verify')

router.get('/' ,verifyToken , async function(req , res){
    const user  = await User.findOne({ _id : req.user });
    res.json({
      status : true,
      user
    })
})

module.exports = router