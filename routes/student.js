var express = require('express');
var router = express.Router();
var studentHelpers = require('../helpers/student-helpers');

verifyLogin = (req, res, next) => {
   if (req.session.student) {
      next();
   }
   else {
      res.redirect('/student/login');
   }
};

/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {
   studentHelpers.getAllClasses(req.session.student._id).then((subjects) => {
      let classId = req.query.class
      res.render('student/home', { title: 'Home', joinClassErr: req.session.studentJoinClassErr, subjects, classId, student: req.session.student });
      req.session.studentJoinClassErr = false
   })
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
   studentHelpers.doLogin(req.body).then((student) => {
      req.session.student = student
      res.redirect('/student')
   }).catch((loginErr) => {
      req.session.studentLoginErr = loginErr
      res.redirect('/student/login')
   })
})

/* GET signup page. */
router.get('/signup', function (req, res, next) {
   if (req.session.student) {
      res.redirect('/student')
   }
   else {
      let institutionId = req.query.institution
      res.render('student/signup', { title: 'SignUp', institutionId, signupErr: req.session.studentSignupErr, student: true })
      req.session.studentSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function (req, res, next) {
   studentHelpers.doSignup(req.body).then((signupMsg) => {
      req.session.studentLoginErr = signupMsg
      res.redirect('/student/login')
   }).catch((signupErr) => {
      req.session.studentSignupErr = signupErr
      res.redirect('/student/signup')
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
      studentHelpers.getInstitutionDetails(student.institution).then(async (institution) => {
         student.institution = institution.name
         student.date = student.date.toDateString()
         if (student.gender === 'Male')
            student.male = 'checked'
         else
            student.female = 'checked'
         let subjects = await studentHelpers.getAllClasses(req.session.student._id)
         res.render('student/profile', { title: 'Profile', subjects, student })
      })
   })
})

/* POST profile page. */
router.post('/profile', verifyLogin, function (req, res, next) {
   studentHelpers.updateStudentDetails(req.body, req.session.student._id).then(async () => {
      req.session.student = await studentHelpers.getStudentDetails(req.session.student._id)
      res.redirect('/student/profile')
   })
})

/* POST profile picture. */
router.post('/profile-picture', verifyLogin, function (req, res, next) {
   studentHelpers.updateStudentProfilePicture(req.session.student._id, req.files).then(async () => {
      req.session.student = await studentHelpers.getStudentDetails(req.session.student._id)
      res.redirect('/student/profile')
   })
})

/* GET institution announcement page. */
router.get('/institution-announcement', verifyLogin, function (req, res, next) {
   studentHelpers.getAllInstitutionAnnouncements().then((announcements) => {
      res.render('student/institution-announcement', { title: 'Institution Announcement', announcements, student: req.session.student })
   })
})

/* GET tutor announcement page. */
router.get('/tutor-announcement', verifyLogin, function (req, res, next) {
   studentHelpers.getAllTutorAnnouncements(req.session.student.subjects).then((announcements) => {
      res.render('student/tutor-announcement', { title: 'Tutor Announcement', announcements, student: req.session.student })
   })
})

/* POST join class */
router.post('/join-class', verifyLogin, function (req, res, next) {
   studentHelpers.joinClass(req.session.student._id, req.body.class).then(async () => {
      req.session.student = await studentHelpers.getStudentDetails(req.session.student._id)
      res.redirect('/student')
   }).catch((joinClassErr) => {
      req.session.studentJoinClassErr = joinClassErr
      res.redirect('/student')
   })
})

router.get('/unenroll-class/:id', verifyLogin, function (req, res, next) {
   studentHelpers.unenrollClass(req.session.student._id, req.params.id).then(async () => {
      req.session.student = await studentHelpers.getStudentDetails(req.session.student._id)
      res.redirect('/student')
   })
})

router.get('/view-class/:id', verifyLogin, async function (req, res, next) {
   let subject = await studentHelpers.getClassDetails(req.params.id)
   subject.topics.forEach((topic) => {
      topic.date = topic.date.toDateString()
   })
   res.render('student/view-class', { title: 'view Class', subject, student: req.session.student })
})

router.post('/view-topic', verifyLogin, async function (req, res, next) {
   let topic = await studentHelpers.getTopicDetails(req.body.id)
   res.json(topic)
})

/*POST search result*/
router.post('/search-topic',verifyLogin,function(req,res,next){
   let search = req.body;
   let searchSubject = req.body.id;
   tutorHelpers.searchTopic(search).then((topics) => {

      topics.forEach((topic) => {
         topic.date = topic.date.toDateString()
      })
      // console.log(searchResult);
      let searchCount = null;
      if(topics.length>0){
         searchCount = topics.length;
         res.render('tutor/search-topics', { title: 'My Class', tutor: true, tutorDetails: req.session.tutor, topics, searchCount, searchSubject })
      }
      else{
         searchCount = topics.length;
         res.render('tutor/search-topics', { title: 'My Class', tutor: true, tutorDetails: req.session.tutor, topics,searchCount, searchSubject })
      }
      
   })
})

module.exports = router;