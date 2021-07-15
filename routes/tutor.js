var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Home', tutor:true});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   res.render('tutor/login', {title:'Login', tutor:true})
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   res.render('tutor/signup', {title:'SignUp', tutor:true})
})

module.exports = router;