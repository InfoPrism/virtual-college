var express = require('express');
var router = express.Router();
var tutorHelpers = require('../helpers/tutor-helpers');
var objectId = require('mongodb').ObjectID;

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
   let subjects = await tutorHelpers.getAllSubjectDetails(tutorDetails._id);
   res.render('tutor/home', { title: 'Home', tutor: true, tutorDetails, subjects });
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
   tutorHelpers.doLogin(req.body).then((tutor) => {
         req.session.tutor = tutor
         res.redirect('/tutor')
      }).catch((loginErr) => {
         req.session.tutorLoginErr = loginErr
         res.redirect('/tutor/login')
      })
})

/* GET signup page. */
router.get('/signup', function (req, res, next) {
   if (req.session.tutor) {
      res.redirect('/tutor')
   }
   else {
      let institutionId = req.query.institution
      res.render('tutor/signup', { title: 'SignUp', institutionId, signupErr: req.session.tutorSignupErr, tutor: true })
      req.session.tutorSignupErr = false
   }
})

/* POST signup page. */
router.post('/signup', function (req, res, next) {
   tutorHelpers.doSignup(req.body).then((signupMsg) => {
      console.log(signupMsg);
      req.session.tutorLoginErr = signupMsg
      res.redirect('/tutor/login')
   }).catch((signupErr) => {
      req.session.tutorLoginErr = signupErr
      res.redirect('/tutor/signup')
   })
})

/* Logout */

router.get('/logout', function (req, res, next) {
   req.session.tutor = null;
   res.redirect('/tutor')
})

/* GET profile page. */
router.get('/profile', verifyLogin, function (req, res, next) {
   tutorHelpers.getTutorDetails(req.session.tutor._id).then((tutor) => {
      tutorHelpers.getInstitutionDetails(tutor.institution).then(async (institution) => {
         tutor.institution = institution.name
         tutor.date = tutor.date.toDateString()
         if (tutor.gender === 'Male')
            tutor.male = 'checked'
         else
            tutor.female = 'checked'
         let subjects = await tutorHelpers.getAllSubjectDetails(req.session.tutor._id)
         res.render('tutor/profile', { title: 'Profile', subjects, tutor, tutorDetails: req.session.tutor })
      })
   })
})

/* POST profile page. */
router.post('/profile', verifyLogin, function (req, res, next) {
   tutorHelpers.updateTutorDetails(req.body, req.session.tutor._id).then(async () => {
      req.session.tutor = await tutorHelpers.getTutorDetails(req.session.tutor._id)
      res.redirect('/tutor/profile')
   })
})

/* POST profile picture. */
router.post('/profile-picture', verifyLogin, function (req, res, next) {
   tutorHelpers.updateTutorProfilePicture(req.session.tutor._id, req.files).then(async () => {
      req.session.tutor = await tutorHelpers.getTutorDetails(req.session.tutor._id)
      res.redirect('/tutor/profile')
   })
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

/* GET edit-subject */
router.post('/edit-subject/:id', verifyLogin, async function (req, res, next) {
   req.body.tutor = req.session.tutor._id;
   tutorHelpers.editSubject(req.params.id, req.body).then(() => {
      res.redirect('/tutor/view-subject/' + req.params.id);
   })
})

/* GET all announcement page. */

router.get('/announcement', verifyLogin, function (req, res, next) {
   tutorHelpers.getAllAnnouncements().then((announcements) => {
      res.render('tutor/announcement', { title: 'Announcement', announcements, tutor: true, tutorDetails: req.session.tutor })
   })
})

/* GET my announcements page. */

router.get('/my-announcements', verifyLogin, function (req, res, next) {
   tutorHelpers.getMyannouncements(req.session.tutor._id).then((announcements) => {
      res.render('tutor/my-announcements', { title: 'My Announcements', announcements, tutor: true, tutorDetails: req.session.tutor })
   })
})

/* GET add announcement page. */

router.get('/add-announcement', verifyLogin, function (req, res, next) {
   tutorHelpers.getSubjects(req.session.tutor._id).then((subjects) => {
      res.render('tutor/add-announcement', { title: 'Add Announcement', subjects, tutor: true, tutorDetails: req.session.tutor })

   })
})

/* POST my announcement page. */

router.post('/add-announcement', verifyLogin, function (req, res, next) {
   tutorHelpers.postMyAnnouncements(req.body).then(() => {
      res.redirect('/tutor/my-announcements')
   })
})

/* Delete my announcement */

router.get('/delete-announcement', verifyLogin, function (req, res, next) {
   tutorHelpers.deleteMyAnnouncement(req.query.id).then(() => {
      res.redirect('/tutor/my-announcements')
   })
})

/* Delete Subject */

router.get('/delete-subject/:id', verifyLogin, function (req, res, next) {
   tutorHelpers.deleteSubject(req.params.id).then(() => {
      res.redirect('/tutor')
   })
})

/* View my class */

router.get('/view-subject/:id', verifyLogin, function (req, res, next) {
   let subjectId = req.params.id
   tutorHelpers.getEachSubject(subjectId).then((subject) => {
      subject.topics.forEach((topic) => {
         topic.date = topic.date.toDateString()
      })
      res.render('tutor/my-class', { title: 'My Class', tutor: true, tutorDetails: req.session.tutor, subject })
   })
})

/* upload a post to your class*/

router.post('/upload-class', verifyLogin, function (req, res, next) {
   req.body.tutor = req.session.tutor._id;
   if (req.files == undefined) {
      tutorHelpers.postUploadClassWithoutFile(req.body).then(() => {
         res.redirect('/tutor/view-subject/' + req.body.subject)
      })
   }
   else {
      tutorHelpers.postUploadClassWithFile(req.body, req.files).then(() => {
         res.redirect('/tutor/view-subject/' + req.body.subject)
      })
   }
})

/* POST view-topic */
router.post('/view-topic', verifyLogin, async function (req, res, next) {
   let topic = await tutorHelpers.getTopicDetails(req.body.id)
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

/* POST remove-topic */
router.post('/remove-topic', verifyLogin, function (req, res, next) {
   tutorHelpers.removeTopic(req.body.id).then(() => {
      res.json({ status: true })
   })
})

module.exports = router;