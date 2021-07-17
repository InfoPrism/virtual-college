var express = require('express');
var router = express.Router();
var tutorHelpers = require('../helpers/tutor-helpers');

verifyLogin = function(req, res, next) {
  if(req.session.tutor)
  {
    next();
  }
  else
  {
    res.redirect('/tutor/login');
  }
};

/* GET home page. */
router.get('/', verifyLogin, function(req, res, next) {
  res.render('index', {title:'Home', tutor:true});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   if(req.session.tutor)
   {
      res.redirect('/tutor')
   }
   else
   {
      res.render('tutor/login', {title:'Login', loginErr:req.session.tutorLoginErr, tutor:true})
      req.session.tutorLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function(req, res, next) {
   tutorHelpers.doLogin(req.body).then((response) => {
      if(response.status)
      {
         req.session.tutor = response.tutor
         res.redirect('/tutor')
      }
      else
      {
         req.session.tutorLoginErr = response.loginErr
         res.redirect('/tutor/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   if(req.session.tutor)
   {
      res.redirect('/tutor')
   }
   else
   {
      res.render('tutor/signup', {title:'SignUp', signupErr:req.session.tutorSignupErr, tutor:true})
      req.session.tutorSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function(req, res, next) {
   tutorHelpers.doSignup(req.body).then((response) => {
      if(response.status)
      {
         req.session.tutor = response.tutor
         res.redirect('/tutor')
      }
      else
      {
         req.session.tutorSignupErr = response.signupErr
         res.redirect('/tutor/signup')
      }
   })
})

module.exports = router;