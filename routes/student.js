var express = require('express');
var router = express.Router();
var studentHelpers = require('../helpers/student-helpers');

verifyLogin = function (req, res, next) {
   if (req.session.student) {
      next();
   }
   else {
      res.redirect('/student/login');
   }
};

/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {
   res.render('student/home', { title: 'Home', student: req.session.student });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
   if (req.session.student) {
      res.redirect('/student')
   }
   else {
      res.render('student/login', { title: 'Login', loginErr: req.session.studentLoginErr, student: true })
      req.session.studentLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function (req, res, next) {
   studentHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
         req.session.student = response.student
         res.redirect('/student')
      }
      else {
         req.session.studentLoginErr = response.loginErr
         res.redirect('/student/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function (req, res, next) {
   if (req.session.student) {
      res.redirect('/student')
   }
   else {
      res.render('student/signup', { title: 'SignUp', signupErr: req.session.studentSignupErr, student: true })
      req.session.studentSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function (req, res, next) {
   studentHelpers.doSignup(req.body).then((response) => {
      if (response.status) {
         req.session.student = response.student
         res.redirect('/student')
      }
      else {
         req.session.studentSignupErr = response.signupErr
         res.redirect('/student/signup')
      }
   })
})

/* GET logout page. */
router.get('/logout', function (req, res, next) {
   req.session.student = null
   res.redirect('/student/login')
})

/* GET profile page. */
router.get('/profile', verifyLogin, function (req, res, next) {
   studentHelpers.getStudentDetails(req.session.student._id).then((student) => {
      studentHelpers.getInstitutionDetails(student.institution).then((institution) => {
         student.institution = institution.name
         student.date = student.date.toDateString()
         if (student.gender === 'Male')
            student.male = 'checked'
         else
            student.female = 'checked'
         res.render('student/profile', { title: 'Profile', student })
      })
   })
})

/* POST profile page. */
router.post('/profile', verifyLogin, function(req, res, next) {
   studentHelpers.updateStudentDetails(req.body, req.session.student._id).then(async()=> {
      req.session.student = await studentHelpers.getStudentDetails(req.session.student._id)
      res.redirect('/student/profile')
   })
})

module.exports = router;