const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req
  //   .get('Cookie')
  //   ?.split(';')[1]
  //   .trim()
  //   .split('=')[1];
  const isLoggedIn = req.session.isLoggedIn;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('670bcc2b3730292380bfcc20')
      .then(user => {        
        req.session.isLoggedIn = true
        req.session.user = user;
        req.session
        .save(err=> {
                      console.log(err)
                      res.redirect('/');
                    })
      })
}
      

exports.postLogout = (req,res,next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/login') 
  });
}