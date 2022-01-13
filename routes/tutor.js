var express = require('express');
var router = express.Router();
var tutorHelpers = require('../helpers/tutor-helpers');

verifyLogin = function (req, res, next) {
   if (req.session.tutor) {
      next();
   }
   else {
      res.redirect('/tutor/login');
   }
};

/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {
   let tutorDetails = req.session.tutor;
   res.render('tutor/home', { title: 'Home', tutor: true,tutorDetails });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
   if (req.session.tutor) {
      res.redirect('/tutor')
   }
   else {
      res.render('tutor/login', { title: 'Login', loginErr: req.session.tutorLoginErr, tutor: true })
      req.session.tutorLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function (req, res, next) {
   tutorHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
         req.session.tutor = response.tutor
         res.redirect('/tutor')
      }
      else {
         req.session.tutorLoginErr = response.loginErr
         res.redirect('/tutor/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function (req, res, next) {
   if (req.session.tutor) {
      res.redirect('/tutor')
   }
   else {
      res.render('tutor/signup', { title: 'SignUp', signupErr: req.session.tutorSignupErr, tutor: true })
      req.session.tutorSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function (req, res, next) {
   tutorHelpers.doSignup(req.body).then((response) => {
      if (response.status) {
         req.session.tutor = response.tutor
         res.redirect('/tutor')
      }
      else {
         req.session.tutorSignupErr = response.signupErr
         res.redirect('/tutor/signup')
      }
   })
})

/*Get classs details to modal*/

router.get('/get-class', verifyLogin, async function (req, res, next) {
   let classes = await tutorHelpers.getAllClass(req.session.tutor.institution)
   res.json(classes)
})

/*submiting subject details*/

router.post('/add-subject', verifyLogin, async function (req, res, next) {
   req.body.tutor_id = req.session.tutor._id;
   tutorHelpers.addSubject(req.body).then(() => {
      res.redirect('/tutor');
   })
})

module.exports = router;