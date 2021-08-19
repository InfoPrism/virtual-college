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
   institutionHelpers.generateInstitutionId().then((institutionId) => {
      res.json(institutionId)
   })
})

/*GET add a new class by institution*/
router.get('/add-class',verifyLogin,async function(req,res,next){
   let classes = await institutionHelpers.getAllClass()
   console.log(classes);
  res.render('institution/add-class',{title:'Add Class',institution:true,classes,})
})

/*POST add a new class by institution*/
router.post('/add-class',verifyLogin,function(req,res,next){
   institutionHelpers.addClass(req.body).then(()=>{
   res.redirect('/institution/add-class')
   })
})
module.exports = router;