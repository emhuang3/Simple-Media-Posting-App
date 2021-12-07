var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotecters').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  // res.render('index', { title: 'CSC 317 App', name:"Emily Huang" });
  res.render('index');
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
