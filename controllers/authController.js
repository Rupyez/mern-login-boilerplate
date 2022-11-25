const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

//function for handling errors
const handleErrors=(err)=>{
    const error = {
        email:'',
        password:''
    }



if(err.message==='incorrect email'){
    error.email ="Email is Incorrect"
}

if(err.message==='incorrect Password'){
    error.password='Password is incorrect'
}

//this error occurs if email has already been used
if(err.code===11000){
    error.email="Email already exist"
}

if(err._message==='User validation failed'){
    //email error handling
if(err.errors.email){
    error.email= err.errors.email.properties.message
}

//password error handling
if(err.errors.password){
    error.password= err.errors.password.properties.message
}

}

    return error
}




const returnSignupPage = (req, res) => {
    res.render("signup")
}

const returnLoginPage = (req, res) => {
    res.render("login")
}

const createUser = async (req, res) => {
try{
const user = await User.create(req.body);

//tokern generation
const token = jwt.sign({user:user._id}, 'TOKEN_SECRET',{
    expiresIn:'1d'
})
res.cookie('jwt', token);

res.json({user:user._id})
}catch(err){
console.log(err)
// res.send("Error Occured")

//error handling
const processedErrorObject = handleErrors(err);
res.json({errors:processedErrorObject})
}
}



const loginUser = async(req, res) => {
    //Code
const {email, password} = req.body;
try{
const user = await User.findOne({email});
if(user){
const passwordMatch = await bcrypt.compare(password, user.password)
if(passwordMatch){
    const token = jwt.sign({user:user._id}, 'TOKEN_SECRET',{
        expiresIn:'1d'
    })
    res.cookie('jwt', token);
    
    res.json({user:user._id})
}else{
    throw Error('incorrect Password')
}
}else{
    throw new Error('incorrect email')
}
}catch(err){
    const processErroredObject = handleErrors(err);
    res.json({errors:processErroredObject})
}
}

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {maxAge:2});
    res.redirect('/')
}

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
}