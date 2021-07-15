var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Home', student:true});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   res.render('student/login', {title:'Login', student:true})
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   res.render('student/signup', {title:'SignUp', student:true})
})

module.exports = router;