const mongo = require('mongoose')

const UserSchema = new mongo.Schema({
  username : {
    type : String,
   required : [true , "username is Requirred"]
   },
  email : {
    type : String,
   required : [true , "username is Requirred"]
   },
  password : {
    type : String,
   required : [true , "username is required"]
   },
  full_name : {
    type : String,
   required : [true , "Full name is required"]
   },
  age : {
    type : Number,
   required : [true , "Age is required"]
   },
  gender : {
    type : String,
   required : [true , "Gender feild is required"]
   },
  profession : {
    type : String,
   required : [true , "Profession feild is required"]
   },
  skills : {
    type : String,
   required : [true , "Skills feilds is required"]
   },
  qualification : {
    type : String,
   required : [true , "Qualification feild is required"]
   },
   institute : {
    type : String,
   required : [true , "Institute feild is required"]
   },
   linkedin : {
    type : String,
   required : [true , "Enter your linkedin link"]
   },
   about : {
    type : String,
   required : [true , "About feild is required"]
   },
});
const User= mongo.model('users' , UserSchema)
module.exports = User