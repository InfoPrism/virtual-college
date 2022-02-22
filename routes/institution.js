var express = require('express');
var router = express.Router();
var institutionHelpers = require('../helpers/institution-helpers');

verifyLogin = function(req, res, next) {
  if(req.session.institution)
  {
    next();
  }
  else
  {
    res.redirect('/institution/login');
  }
};

/* GET logout page. */
router.get('/logout', function (req, res, next) {
   req.session.institution = null
   res.redirect('/institution/login')
})
/* GET home page. */
router.get('/', verifyLogin, function(req, res, next) {
   let institutionDetails= req.session.institution;
  res.render('institution/home', {title:'Home', institution:true, institutionDetails});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   if(req.session.institution)
   {
      res.redirect('/institution')
   }
   else
   {
      res.render('institution/login', {title:'Login', loginErr:req.session.institutionLoginErr, institution:true})
      req.session.institutionLoginErr = false
   }
})

/* POST login page. */
router.post('/login', function(req, res, next) {
   institutionHelpers.doLogin(req.body).then((response) => {
      if(response.status)
      {
         req.session.institution = response.institution
         res.redirect('/institution')
      }
      else
      {
         req.session.institutionLoginErr = response.loginErr
         res.redirect('/institution/login')
      }
   })
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   if(req.session.institution)
   {
      res.redirect('/institution')
   }
   else
   {
      institutionHelpers.generateInstitutionId().then((institutionId) => {
         res.render('institution/signup', {title:'SignUp', institutionId, signupErr:req.session.institutionSignupErr, institution:true})
         req.session.institutionSignupErr = false
      })
   }
})

/* POST signup page. */
router.post('/signup', function(req, res, next) {
   institutionHelpers.doSignup(req.body).then((response) => {
      if(response.status)
      {
         req.session.institution = response.institution
         res.redirect('/institution')
      }
      else
      {
         req.session.institutionSignupErr = response.signupErr
         res.redirect('/institution/signup')
      }
   })
})

/* POST regenerate institutionid */
router.post('/regenerate-institutionid', function(req, res, next) {
   console.log("ggggggggggggggggggggggggg");
   institutionHelpers.generateInstitutionId().then((institutionId) => {
      console.log("mmmmmmmmmm");
      console.log(institutionId);
      res.json(institutionId)
   })
})

/*GET add a new class by institution*/
router.get('/add-class',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution
   let classes = await institutionHelpers.getAllClass(institutionDetails._id)
   console.log(classes);
  res.render('institution/add-class',{title:'Add Class',institution:true,classes,institutionDetails})
})

/*POST add a new class by institution*/
router.post('/add-class',verifyLogin,function(req,res,next){
   institutionHelpers.addClass(req.body).then(()=>{
   res.redirect('/institution/add-class')
   })
})
/*GET Everyone Annoucement*/
router.get('/everyOne-announcement',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let announcements= await institutionHelpers.getAnnouncements('Everyone',institutionDetails._id)
  res.render('institution/everyOne-announcement',{title:'Everyone Announcements',institution:true,announcements})
})
/*GET Student Annoucement*/
router.get('/student-announcement',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let announcements= await institutionHelpers.getAnnouncements('Student',institutionDetails._id)
  res.render('institution/student-announcement',{title:'Student Announcements',institution:true,announcements})
})
/*GET Tutor Annoucement*/
router.get('/tutor-announcement',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let announcements= await institutionHelpers.getAnnouncements('Tutor',institutionDetails._id)
  res.render('institution/tutor-announcement',{title:'Tutor Announcements',institution:true,announcements})
})
/*GET Create new Announcement*/
router.get('/add-announcement',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution
   console.log("ddddddd");
   console.log(institutionDetails);
  res.render('institution/add-announcement',{title:'Add Announcement',institution:true,institutionDetails})
})

/* POST Create new Announcement. Here we check the announcement is created to whom and it will redirect to that page*/
router.post('/add-announcement', function(req, res, next) {
   let announcement=req.body;
   institutionHelpers.addAnnouncement(req.body).then((response) => {
      if(announcement.visiblity=='Everyone')
       res.redirect('/institution/everyOne-announcement')
      else if(announcement.visiblity=='Student')
       res.redirect('/institution/student-announcement')
      else
       res.redirect('/institution/tutor-announcement')
   })
})
/*GET all Students under corresponding Institution*/
router.get('/all-students',verifyLogin,async function(req,res,next){
   let type=req.params.type
   console.log("ppppppppppp");
   console.log(type);
   let institutionDetails=req.session.institution;
   let StudentsIn_institution= await institutionHelpers.getStudentsIn_institution(institutionDetails._id)
   let slno = 1
   StudentsIn_institution.forEach(student => {
      student.slno = slno
      console.log(student.slno);
      slno++
   })
   slno = null
  res.render('institution/all-students',{title:'All Students',institution:true,StudentsIn_institution,institutionDetails})
})
/*GET Everyone Annoucement*/
router.post('/student-info/:id',verifyLogin,async function(req,res,next){
   console.log("api call..............................");
   let institutionDetails=req.session.institution;
   let announcements= await institutionHelpers.getAnnouncements('Everyone',institutionDetails._id)
  res.render('institution/everyOne-announcement',{title:'Everyone Announcements',institution:true,announcements})
})
/*GET student details to display student details in a model*/
router.get('/get-student-details/:id',verifyLogin,async function(req,res,next){
   let studentDetail= await institutionHelpers.getStudentDetails(req.params.id)
   res.json(studentDetail)
   console.log("ddddddddddddd");
   console.log(studentDetail);
})
 

/*GET to display page to create ne remark to student*/
router.get('/add-remarks/:id',verifyLogin,async function(req,res,next){
   let studentDetail= await institutionHelpers.getStudentDetails(req.params.id)
   let institutionDetails=req.session.institution;
   let head_of_Institution=institutionDetails.head;
  res.render('institution/add-remark',{title:'Add Remark',institution:true,studentDetail,head_of_Institution})
})
 /*POST add a new remark to student by institution*/
 router.post('/add-remarks',verifyLogin,function(req,res,next){
   institutionHelpers.addRemarks(req.body).then(async()=>{
      let studentDetail= await institutionHelpers.getStudentDetails(req.body.StudentId)
      
      /*res.redirect('/institution/view-student-remarks?id=' + studentDetail._id)*/
      res.redirect('/institution/all-students')
   })
})
 /*Get student remarks*/
router.get('/view-student-remarks/:id',verifyLogin,async function(req,res,next){
   let studentRemarks= await institutionHelpers.getStudentRemarks(req.params.id)
   let studentDetail= await institutionHelpers.getStudentDetails(req.params.id)
   res.render('institution/student-remarks',{studentRemarks,studentDetail,institution:true,title:studentDetail.fname+' remarks'})
})
/*GET all Tutors under corresponding Institution*/
router.get('/all-tutors',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let tutorsIn_institution= await institutionHelpers.getTutorsIn_institution(institutionDetails._id)
   let slno = 1
   tutorsIn_institution.forEach(student => {
      student.slno = slno
      console.log(student.slno);
      slno++
   })
   slno = null
  res.render('institution/all-tutors',{title:'All Tutors',institution:true,tutorsIn_institution,institutionDetails})
})
/*GET tutor details to display tutor details in a model*/
router.get('/get-tutor-details/:id',verifyLogin,async function(req,res,next){
   let tutorDetail= await institutionHelpers.getTutorDetails(req.params.id)
   res.json(tutorDetail)
   console.log("ddddddddddddd........");
   console.log(tutorDetail);
})
 
/*GET add a new remark to student by institution*/
router.get('/add-tutor-remarks/:id',verifyLogin,async function(req,res,next){
   let tutorDetail= await institutionHelpers.getTutorDetails(req.params.id)
   let institutionDetails=req.session.institution;
   let head_of_Institution=institutionDetails.head;
  res.render('institution/add-tutor-remark',{title:'Add Remark',institution:true,tutorDetail,head_of_Institution})
})
 /*POST add a new remark to tutor by institution*/
 router.post('/add-tutor-remarks',verifyLogin,function(req,res,next){
   institutionHelpers.addTutorRemarks(req.body).then(async()=>{
      let tutorDetail= await institutionHelpers.getTutorDetails(req.body.tutorId)
      res.redirect('/institution/all-tutors')
   })
})
 /*Get tutor remarks*/
router.get('/view-tutor-remarks/:id',verifyLogin,async function(req,res,next){
   let tutorDetail= await institutionHelpers.getTutorDetails(req.params.id)
   let tutorRemarks= await institutionHelpers.getTutorRemarks(req.params.id)
   let institutionDetails=req.session.institution;
   res.render('institution/view-tutor-remarks',{tutorRemarks,tutorDetail,institution:true,title:tutorDetail.fname+' remarks'})
})
/*GET not verified  Students under corresponding Institution */
router.get('/notverified-students',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let NotVerifiedStudents= await institutionHelpers.getNotVerifiedStudentsIn_institution(institutionDetails._id)
   let slno = 1
   NotVerifiedStudents.forEach(student => {
      student.slno = slno
      console.log(student.slno);
      slno++
   })
   slno = null
  res.render('institution/notVerified-students',{title:'All Students',institution:true,NotVerifiedStudents,institutionDetails})
})
/*POST change student status*/
router.get('/change-student-status/:status/:id',verifyLogin,async function(req,res,next){
   let status=req.params.status
   let studentId=req.params.id
   let data= await institutionHelpers.changeStudentStatus(studentId,status)
   if(status=="Blocked")
   res.redirect('/institution/all-students')
   else
   res.redirect('/institution/notverified-students')
})
/*POST cange tutor status*/
router.get('/change-tutor-status/:status/:id',verifyLogin,async function(req,res,next){
   let status=req.params.status
   let tutorId=req.params.id
   let data= await institutionHelpers.changeTutorStatus(tutorId,status)
   console.log(data);
   if(status=="Blocked")
   res.redirect('/institution/all-tutors')
   else
   res.redirect('/institution/notverified-tutors')
})
/*GET not verified  Students under corresponding Institution */
router.get('/notverified-tutors',verifyLogin,async function(req,res,next){
   let institutionDetails=req.session.institution;
   let NotVerifiedTutors= await institutionHelpers.getNotVerifiedTutorsIn_institution(institutionDetails._id)
   let slno = 1
   NotVerifiedTutors.forEach(tutor => {
      tutor.slno = slno
      console.log(tutor.slno);
      slno++
   })
   slno = null
  res.render('institution/notVerified-tutors',{title:'All Students',institution:true,NotVerifiedTutors,institutionDetails})
})
module.exports = router;
