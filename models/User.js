const mongoose = require('mongoose');
const validator = require("validator")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  //Schema
email:{
  type:String,
  required:[true, "Email is Required"],
  unique:true,
  validate: [validator.isEmail,"Please enter a valid email"] //custom validate for email
},

password:{
  type:String,
  required:[true,"Enter Password"],
  minlength:[6, "Password should be at least 6 characters long"]
}  

})


// password encryption runs before data in database          

//note we cant use {this} at arrow or callback function   but we can use at normal function
userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt()
this.password = await bcrypt.hash(this.password, salt);
next();
})

const User = new mongoose.model('User', userSchema);

module.exports = User;