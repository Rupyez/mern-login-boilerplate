const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {

  //Middlewares

  //token verfication
const {jwt:token} = req.cookies;
if(token){
const isValid = jwt.verify(token, 'TOKEN_SECRET');
if(isValid){
next();
}else{
  res.redirect('/login')
}
}else{
  res.redirect('/login')
}

};

module.exports = { requireAuth };
