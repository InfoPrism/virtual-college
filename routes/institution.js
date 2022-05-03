var express = require('express');
var router = express.Router();
var institutionHelpers = require('../helpers/institution-helpers');
const url = require('url');

verifyLogin = function (req, res, next) {
   if (req.session.institution) {
      next();
   }
   else {
      res.redirect('/institution/login');
   }
};

/* GET logout page. */
router.get('/logout', function (req, res, next) {
   req.session.institution = null
   res.redirect('/institution/login')
})
/* GET home page. */
router.get('/', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let resolveType = 'length'
   let status = 'Signup pending'
   let NoSignupPendingStudents = await institutionHelpers.getNotVerifiedStudentsIn_institution(institutionDetails._id, resolveType)
   let NoSignupPendingTutors = await institutionHelpers.getTutorsOfDifferentStatus(institutionDetails._id, status, resolveType)
   res.render('institution/home', { title: 'Home', institution: true, institutionDetails, NoSignupPendingStudents, NoSignupPendingTutors });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
   if (req.session.institution) {
      res.redirect('/institution')
   }
   else {
      res.render('institution/login', { title: 'Login', loginErr: req.session.institutionLoginErr, institution: true })
      req.session.institutionLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function (req, res, next) {
   institutionHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
         req.session.institution = response.institution
         res.redirect('/institution')
      }
      else {
         req.session.institutionLoginErr = response.loginErr
         res.redirect('/institution/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function (req, res, next) {
   if (req.session.institution) {
      res.redirect('/institution')
   }
   else {
      institutionHelpers.generateInstitutionId().then((institutionId) => {
         res.render('institution/signup', { title: 'SignUp', institutionId, signupErr: req.session.institutionSignupErr, institution: true })
         req.session.institutionSignupErr = false
      })
   }
})

/* POST signup page. */
router.post('/signup', function (req, res, next) {
   institutionHelpers.doSignup(req.body).then((response) => {
      if (response.status) {
         req.session.institution = response.institution
         res.redirect('/institution')
      }
      else {
         req.session.institutionSignupErr = response.signupErr
         res.redirect('/institution/signup')
      }
   })
})

/* POST regenerate institutionid */
router.get('/regenerate-institutionid-update', function (req, res, next) {
   let page = null
   page= req.query.page;
   let institutionDetails = req.session.institution;
   institutionHelpers.generateInstitutionId().then(async (institutionCode) => {
      institutionHelpers.changeInstitutionId(institutionDetails._id, institutionCode).then(async () => {
         req.session.institution = await institutionHelpers.getInstitutionDetails(req.session.institution._id)
         if(page=="profile"){
         res.redirect('/institution/profile')
         }
         else{
         res.redirect('/institution')
         }
      })
   })
})
/* POST regenerate institutionid */
router.post('/regenerate-institutionid', function (req, res, next) {
   institutionHelpers.generateInstitutionId().then((institutionId) => {
      res.json(institutionId)
   })
})

/*GET add a new class by institution*/
router.get('/add-class', verifyLogin, async function (req, res, next) {
   let classId = req.query.classId
   let subjects = null;
   let status = null
   status = req.query.status;
   let className = req.query.className;
   if (classId)
      subjects = await institutionHelpers.getSubjectsInClass(classId)
   let institutionDetails = req.session.institution
   let classes = await institutionHelpers.getAllClass(institutionDetails._id)
   res.render('institution/add-class', { title: 'Add Class', subjects, className, institution: true, classes, institutionDetails, status })
})

/*POST add a new class by institution*/
router.post('/add-class', verifyLogin, function (req, res, next) {
   let institutionDetails = req.session.institution;
   institutionHelpers.addClass(req.body, institutionDetails._id).then(() => {
      res.redirect(url.format({
         pathname: "/institution/add-class",
         query: {
            "status": "success",
            "name": req.body.name
         }
      }));
   })
})
/*GET Everyone Annoucement*/
router.get('/everyOne-announcement', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let announcements = await institutionHelpers.getAnnouncements('Everyone', institutionDetails._id)
   res.render('institution/everyOne-announcement', { institution: true, institutionDetails, title: 'Everyone Announcements', announcements })
})
/*GET Student Annoucement*/
router.get('/student-announcement', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let announcements = await institutionHelpers.getAnnouncements('Student', institutionDetails._id)
   res.render('institution/student-announcement', { title: 'Student Announcements', institutionDetails, institution: true, announcements })
})
/*GET Tutor Annoucement*/
router.get('/tutor-announcement', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let announcements = await institutionHelpers.getAnnouncements('Tutor', institutionDetails._id)
   res.render('institution/tutor-announcement', { title: 'Tutor Announcements', institutionDetails, institution: true, announcements })
})
/*GET Create new Announcement*/
router.get('/add-announcement', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution
   let visiblity = req.query.visiblity;
   res.render('institution/add-announcement', { title: 'Add Announcement', institution: true, institutionDetails, visiblity })
})

/* POST Create new Announcement. Here we check the announcement is created to whom and it will redirect to that page*/
router.post('/add-announcement', function (req, res, next) {
   let announcement = req.body;
   let institutionDetails = req.session.institution
   institutionHelpers.addAnnouncement(req.body, institutionDetails._id).then((response) => {
      res.redirect(url.format({
         pathname: "/institution/add-announcement",
         query: {
            "visiblity": req.body.visiblity
         }
      }));
   })
})
/*GET all Students under corresponding Institution*/
router.get('/all-students', verifyLogin, async function (req, res, next) {
   let type = req.params.type
   let institutionDetails = req.session.institution;
   let StudentsIn_institution = await institutionHelpers.getStudentsIn_institution(institutionDetails._id)
   let slno = 1
   StudentsIn_institution.forEach(student => {
      student.slno = slno
      slno++
   })
   slno = null
   res.render('institution/all-students', { title: 'All Students', institution: true, StudentsIn_institution, institutionDetails })
})
/*GET Everyone Annoucement*/
router.post('/student-info/:id', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let announcements = await institutionHelpers.getAnnouncements('Everyone', institutionDetails._id)
   res.render('institution/everyOne-announcement', { title: 'Everyone Announcements', institution: true, announcements })
})
/*GET student details to display student details in a model*/
router.get('/get-student-details/:id', verifyLogin, async function (req, res, next) {
   let studentDetail = await institutionHelpers.getStudentDetails(req.params.id)
   res.json(studentDetail)
})


/*GET to display page to create ne remark to student*/
router.get('/add-remarks', verifyLogin, async function (req, res, next) {
   let id = req.query.id;
   let status = req.query.status
   let studentDetail = await institutionHelpers.getStudentDetails(id)
   let institutionDetails = req.session.institution
   let head_of_Institution = institutionDetails.head;
   res.render('institution/add-remark', { title: 'Add Remark', institution: true, institutionDetails, status, studentDetail, head_of_Institution })
})
/*POST add a new remark to student by institution*/
router.post('/add-remarks', verifyLogin, function (req, res, next) {
   institutionHelpers.addRemarks(req.body).then(async () => {
      let studentDetail = await institutionHelpers.getStudentDetails(req.body.StudentId)
      res.redirect(url.format({
         pathname: "/institution/add-remarks",
         query: {
            "id": req.body.StudentId,
            "status": "success"
         }
      }));
   })
})
/*Get student remarks*/
router.get('/view-student-remarks', verifyLogin, async function (req, res, next) {
   let StudentId=req.query.id;
   let institutionDetails = req.session.institution;
   let studentRemarks = await institutionHelpers.getStudentRemarks(StudentId)
   let studentDetail = await institutionHelpers.getStudentDetails(StudentId)
   res.render('institution/student-remarks', { studentRemarks, studentDetail, institutionDetails, institution: true, title: studentDetail.fname + ' remarks' })
})
/*GET all Tutors under corresponding Institution*/
router.get('/all-tutors', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let tutorsIn_institution = await institutionHelpers.getTutorsIn_institution(institutionDetails._id)
   let slno = 1
   tutorsIn_institution.forEach(tutors => {
      tutors.slno = slno
      slno++
   })
   slno = null
   res.render('institution/all-tutors', { title: 'All Tutors', institution: true, tutorsIn_institution, institutionDetails })
})
/*GET tutor details to display tutor details in a model*/
router.get('/get-tutor-details/:id', verifyLogin, async function (req, res, next) {
   let tutorDetail = await institutionHelpers.getTutorDetails(req.params.id)
   res.json(tutorDetail)
})

/*GET add a new remark to student by institution*/
router.get('/add-tutor-remarks', verifyLogin, async function (req, res, next) {
   let status = req.query.status
   let tutorDetail = await institutionHelpers.getTutorDetails(req.query.id)
   let institutionDetails = req.session.institution;
   let head_of_Institution = institutionDetails.head;
   res.render('institution/add-tutor-remark', { title: 'Add Remark', status, institution: true, tutorDetail, head_of_Institution, institutionDetails })
})
/*POST add a new remark to tutor by institution*/
router.post('/add-tutor-remarks', verifyLogin, function (req, res, next) {
   institutionHelpers.addTutorRemarks(req.body).then(async () => {
      let tutorDetail = await institutionHelpers.getTutorDetails(req.body.tutorId)
      res.redirect(url.format({
         pathname: "/institution/add-tutor-remarks",
         query: {
            "id": req.body.tutorId,
            "status": "success"
         }
      }));
   })
})
/*Get tutor remarks*/
router.get('/view-tutor-remarks/:id', verifyLogin, async function (req, res, next) {
   let tutorDetail = await institutionHelpers.getTutorDetails(req.params.id)
   let tutorRemarks = await institutionHelpers.getTutorRemarks(req.params.id)
   let institutionDetails = req.session.institution;
   res.render('institution/view-tutor-remarks', { tutorRemarks, tutorDetail, institution: true, institutionDetails, title: tutorDetail.fname + ' remarks' })
})
/*GET not verified  Students under corresponding Institution */
router.get('/notverified-students', verifyLogin, async function (req, res, next) {
   let institutionDetails = req.session.institution;
   let NotVerifiedStudents = await institutionHelpers.getNotVerifiedStudentsIn_institution(institutionDetails._id, resolveType = 'values')
   let slno = 1
   NotVerifiedStudents.forEach(student => {
      student.slno = slno
      slno++
   })
   slno = null
   res.render('institution/notVerified-students', { title: 'All Students', institution: true, NotVerifiedStudents, institutionDetails })
})
/*POST change student status*/
router.get('/change-student-status/:status/:id/:page', verifyLogin, async function (req, res, next) {
   let status = req.params.status
   let studentId = req.params.id
   let page = req.params.page
   let data = await institutionHelpers.changeStudentStatus(studentId, status)
   if (page == 'all-students')
      res.redirect('/institution/all-students')
   else {
      status = page;
      res.redirect(url.format({
         pathname: "/institution/all-students-different-status",
         query: {
            "status": status
         }
      }));
   }
})
/*POST cange tutor status*/
router.get('/change-tutor-status/:status/:id/:page', verifyLogin, async function (req, res, next) {
   let status = req.params.status
   let tutorId = req.params.id
   let page = req.params.page
   let data = await institutionHelpers.changeTutorStatus(tutorId, status)
   if (page == 'all-tutors')
      res.redirect('/institution/all-tutors')
   else {
      status = page;
      res.redirect(url.format({
         pathname: "/institution/all-tutors-different-status",
         query: {
            "status": status
         }
      }));
   }

})
/*GET not verified  Students under corresponding Institution */
router.get('/all-tutors-different-status', verifyLogin, async function (req, res, next) {
   let status = req.query.status;
   let institutionDetails = req.session.institution;
   let resolveType = 'values'
   let slno = 1
   let signupPendingTutors = [], signupDenyedTutors = [], blockedTutors = [], noTutors = [];
   if (status == "Signup pending") {
      signupPendingTutors = await institutionHelpers.getTutorsOfDifferentStatus(institutionDetails._id, status, resolveType)
      signupPendingTutors.forEach(tutor => {
         tutor.slno = slno
         slno++
      })
      slno = null
   }
   else if (status == "Signup denied") {
      signupDenyedTutors = await institutionHelpers.getTutorsOfDifferentStatus(institutionDetails._id, status, resolveType)
      signupDenyedTutors.forEach(tutor => {
         tutor.slno = slno
         slno++
      })
      slno = null
   }
   else if (status == "Blocked") {
      blockedTutors = await institutionHelpers.getTutorsOfDifferentStatus(institutionDetails._id, status, resolveType)
      blockedTutors.forEach(tutor => {
         tutor.slno = slno
         slno++
      })
      slno = null
   }
   if (signupPendingTutors.length == 0 && signupDenyedTutors.length == 0 && blockedTutors.length == 0) {
      noTutors = [1];
   }
   res.render('institution/tutors-different-status', { title: 'Tutor Different Status', institution: true, signupPendingTutors, signupDenyedTutors, blockedTutors, noTutors, status, institutionDetails })
})

/*GET not verified  Students under corresponding Institution */
router.get('/all-students-different-status', verifyLogin, async function (req, res, next) {
   let status = req.query.status;
   let institutionDetails = req.session.institution;
   let resolveType = 'values'
   let slno = 1
   let signupPendingStudents = [], signupDenyedStudents = [], blockedStudents = [], noStudents = [];
   if (status == "Signup pending") {
      signupPendingStudents = await institutionHelpers.getStudentsOfDifferentStatus(institutionDetails._id, status, resolveType)
      signupPendingStudents.forEach(student => {
         student.slno = slno
         slno++
      })
      slno = null
   }
   else if (status == "Signup denied") {
      signupDenyedStudents = await institutionHelpers.getStudentsOfDifferentStatus(institutionDetails._id, status, resolveType)
      signupDenyedStudents.forEach(student => {
         student.slno = slno
         slno++
      })
      slno = null
   }
   else if (status == "Blocked") {
      blockedStudents = await institutionHelpers.getStudentsOfDifferentStatus(institutionDetails._id, status, resolveType)
      blockedStudents.forEach(student => {
         student.slno = slno
         slno++
      })
      slno = null
   }
   if (signupPendingStudents.length == 0 && signupDenyedStudents.length == 0 && blockedStudents.length == 0) {
      noStudents = [1];
   }
   res.render('institution/students-different-status', { title: 'Student Different Status', institution: true, signupPendingStudents, signupDenyedStudents, blockedStudents, noStudents, status, institutionDetails })
})

/* GET profile page. */
router.get('/profile', verifyLogin, function (req, res, next) {
   institutionHelpers.getInstitutionDetails(req.session.institution._id).then(async (institutionDetails) => {
      let status = req.query.status
      institutionDetails.date = institutionDetails.date.toDateString()
      let classes = await institutionHelpers.getAllClass(req.session.institution._id)
      let noData;
      noData = await institutionHelpers.getNoData(req.session.institution._id)
      maxNoData = Math.max(...noData);
      res.render('institution/profile', { title: 'Profile', status, classes, institutionDetails, maxNoData, noData, institution: true })
   })
})

/* POST profile page. */
router.post('/profile', verifyLogin, function (req, res, next) {
   institutionHelpers.updateInstitutionDetails(req.body, req.session.institution._id).then(async () => {
      req.session.institution = await institutionHelpers.getInstitutionDetails(req.session.institution._id)
      res.redirect(url.format({
         pathname: "/institution/profile",
         query: {
            "status": "success"
         }
      }));
   })
})
/* POST profile picture. */
router.post('/profile-picture', verifyLogin, function (req, res, next) {
   institutionHelpers.updateInstitutionProfilePicture(req.session.institution._id, req.files).then(async () => {
      req.session.institution = await institutionHelpers.getInstitutionDetails(req.session.institution._id)
      res.redirect('/institution/profile')
   })
})

/*GET all classes and subjects in institution*/
router.get('/all-classes-subjects', verifyLogin, async function (req, res, next) {
   let classId = req.query.classId
   let subjects = null;
   let className = req.query.className;
   let institutionDetails = req.session.institution
   let classes = await institutionHelpers.getAllClass(institutionDetails._id)
   let slno = 1
   classes.forEach(class1 => {
      class1.slno = slno
      slno++
   })
   slno = null
   if (classId) {
      subjects = await institutionHelpers.getSubjectsInClass(classId)
      let slno = 1
      subjects.forEach(subject => {
         subject.slno = slno
         slno++
      })
      slno = null
   }
   res.render('institution/all-classes-subjects', { title: 'All Classes', subjects, className, institution: true, classes, institutionDetails })
})
module.exports = router;

