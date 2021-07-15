var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Home', institution:true});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
   res.render('institution/login', {title:'Login', institution:true})
})

/* GET signup page. */
router.get('/signup', function(req, res, next) {
   res.render('institution/signup', {title:'SignUp', institution:true})
})

module.exports = router;