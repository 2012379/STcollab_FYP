const File = require('../models/file_model')

exports.getFiles = async (req , res)=>{
  const files = await File.find().populate('uploaderUserId');
  res.json(files)
}


