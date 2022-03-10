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
router.get('/', verifyLogin, async function (req, res, next) {
   let tutorDetails = req.session.tutor;
   let subjects =await tutorHelpers.getAllSubjectDetails(tutorDetails._id);
   res.render('tutor/home', { title: 'Home', tutor: true,tutorDetails,subjects });
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

/* Logout */

router.get('/logout',function(req,res,next){
   req.session.tutor = null;
   res.redirect('/tutor')
})

/*Get classs details to modal*/

router.get('/get-class', verifyLogin, async function (req, res, next) {
   let classes = await tutorHelpers.getAllClass(req.session.tutor.institution)
   res.json(classes)
})

/*submiting subject details*/

router.post('/add-subject', verifyLogin, async function (req, res, next) {
   req.body.tutor = req.session.tutor._id;
   tutorHelpers.addSubject(req.body).then(() => {
      res.redirect('/tutor');
   })
})

/* GET all announcement page. */

router.get('/announcement', verifyLogin, function (req, res, next) {
   tutorHelpers.getAllAnnouncements().then((announcements) => {
      res.render('tutor/announcement', { title: 'Announcement', announcements, tutor: true,tutorDetails : req.session.tutor})
   })
})

/* GET my announcements page. */

router.get('/my-announcements',verifyLogin,function (req,res,next){
tutorHelpers.getMyannouncements(req.session.tutor._id).then((announcements)=>{
   res.render('tutor/my-announcements',{title : 'My Announcements',announcements,tutor : true,tutorDetails : req.session.tutor})
})
})

/* GET add announcement page. */

router.get('/add-announcement',verifyLogin,function(req,res,next){
   tutorHelpers.getSubjects(req.session.tutor._id).then((subjects)=>{
      res.render('tutor/add-announcement',{title : 'Add Announcement',subjects,tutor : true,tutorDetails : req.session.tutor})

   })
})

/* POST my announcement page. */

router.post('/add-announcement',verifyLogin, function(req,res,next){
   tutorHelpers.postMyAnnouncements(req.body).then(()=>{
      res.redirect('/tutor/my-announcements')
   })
})

/* Delete my announcement */

router.get('/delete-announcement',verifyLogin,function(req,res,next){
   tutorHelpers.deleteMyAnnouncement(req.query.id).then(()=>{
      res.redirect('/tutor/my-announcements')
   })
})

/* Delete Subject */

router.get('/delete-subject/:id',verifyLogin,function(req,res,next){
   res.redirect('/tutor')
})

module.exports = router;