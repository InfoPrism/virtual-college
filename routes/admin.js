var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers');
const url = require('url');

verifyLogin = function (req, res, next) {
    if (req.session.admin) {
       next();
    }
    else {
       res.redirect('/admin/login');
    }
 };

/* GET users listing. */
router.get('/',verifyLogin, async function(req, res, next) {
  let adminDetails=req.session.admin
   console.log(adminDetails);
     res.render('admin/home',{admin:true,adminDetails, title: 'Home'});       
   
});

 router.get("/signup", function (req, res) {
  let adminDetails=req.session.admin
   if (req.session.adminLoggedIn) {
     res.redirect("/admin");
   } else {
     res.render("admin/signup", {admin: true,signUpErr: req.session.signUpErr ,adminDetails, title: 'Signup'}); 
     req.session.signUpErr=false
   }
 })
 
 router.post("/signup", function (req, res) { 
adminHelpers.doSignup(req.body).then((response) => {
     //console.log(req.body);
     if (response.status == false) {
       req.session.signUpErr = "Invalid Admin Code";
       res.redirect("/admin/signup");
     }else if(response.status==true){
         req.session.signUpErr = "Email Id already exist";
         res.redirect("/admin/signup");
       }
     else {
       req.session.admin = response;
       req.session.adminLoggedIn = true;
       res.redirect("/admin");
     }
   });
 })
 
 router.get("/login",function(req,res) {
   
   if(req.session.adminLoggedIn){
     console.log(req.session.admin)
     res.redirect('/admin')
   }else{
      res.render('admin/login',{"loginErr":req.session.adminLoginErr,admin:true, title: 'Login'})
      req.session.adminLoginErr=null
   }
 })
 router.post('/login',(req,res)=>{
   adminHelpers.doLogin(req.body).then((response)=>{
     console.log(response);
     if(response.status){
       req.session.admin=response.admin
       req.session.adminLoggedIn=true
 
     res.redirect('/admin')
     }else{
       req.session.adminLoginErr="Invalid username or password"
       res.redirect('/admin/login')
     }
   })
  })
 router.get('/logout',(req,res)=>{
   req.session.adminLoggedIn=false
   req.session.admin=null
   res.redirect('/admin')
 })
 /*GET all Institutions joined in onOrg*/
router.get('/all-institution', verifyLogin, async function (req, res, next) {
  let adminDetails=req.session.admin
  let institutions = await adminHelpers.getInstitution()
  let slno = 1
  institutions.forEach(institution => {
     institution.slno = slno
     slno++
  })
  slno = null
  res.render('admin/all-institution', { title: 'All Institution',admin: true, institutions,adminDetails})
})
 /*GET all Admins joined in onOrg*/
 router.get('/all-admins', verifyLogin, async function (req, res, next) {
  let adminDetails=req.session.admin
  let admins = await adminHelpers.getAdmins()
  let slno = 1
  admins.forEach(admin => {
     admin.slno = slno
     slno++
  })
  slno = null
  res.render('admin/all-admins', { title: 'All Admins',admin: true, admins,adminDetails})
})
 /*GET all Institutions joined in onOrg*/
 router.get('/institution-details', verifyLogin, async function (req, res, next) {
   let institutionId=req.query.id;
   let adminDetails=req.session.admin
   console.log("8888888888888888");
   console.log(adminDetails);
   let institutionDetails = await adminHelpers.getInstitutionDetails(institutionId);
   let classes = await adminHelpers.getAllClass(institutionId)
   let noData;
   noData = await adminHelpers.getNoData(institutionId)
  res.render('admin/institution-details', { title: 'Institution Details',classes,noData,admin: true, institutionDetails,adminDetails})
})
module.exports = router;