var express = require('express');
var router = express.Router();
var studentHelpers = require('../helpers/student-helpers');

verifyLogin = function(req, res, next) {
  if(req.session.student)
  {
    next();
  }
  else
  {
    res.redirect('/student/login');
  }
};

/* GET home page. */
router.get('/', verifyLogin, function(req, res, next) {
  res.render('student/home', {title:'Home', student:true});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   if(req.session.student)
   {
      res.redirect('/student')
   }
   else
   {
      res.render('student/login', {title:'Login', loginErr:req.session.studentLoginErr, student:true})
      req.session.studentLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function(req, res, next) {
   studentHelpers.doLogin(req.body).then((response) => {
      if(response.status)
      {
         req.session.student = response.student
         res.redirect('/student')
      }
      else
      {
         req.session.studentLoginErr = response.loginErr
         res.redirect('/student/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   if(req.session.student)
   {
      res.redirect('/student')
   }
   else
   {
      res.render('student/signup', {title:'SignUp', signupErr:req.session.studentSignupErr, student:true})
      req.session.studentSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function(req, res, next) {
   studentHelpers.doSignup(req.body).then((response) => {
      if(response.status)
      {
         req.session.student = response.student
         res.redirect('/student')
      }
      else
      {
         req.session.studentSignupErr = response.signupErr
         res.redirect('/student/signup')
      }
   })
})

module.exports = router;