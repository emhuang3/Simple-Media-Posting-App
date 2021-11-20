var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotecters').userIsLoggedIn;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Emily Huang" });
});

router.get('/login', (req, res, next)=>{
  res.render('login');
})

router.get('/registration', (req, res, next)=>{
  res.render('registration');
})

router.get('/home', (req, res, next)=>{
  res.render('home');
})

router.get('/viewpost', (req, res, next)=>{
  res.render('viewpost');
})

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req, res, next)=>{
  res.render('postimage');
})

module.exports = router;
