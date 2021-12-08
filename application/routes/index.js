var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotecters').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
var db = require("../conf/database")

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

router.get('/post/:id(\\d+)', (req, res, next)=>{
  let baseSQL = "\
  SELECT u.username, p.title, p.description, p.photopath, p.createdAt\
  FROM users u\
  JOIN posts p\
  ON u.id=fk_userId\
  WHERE p.id=?;";

  let postId = req.params.id;
  db.execute(baseSQL, [postId])
  .then(([results, fields])=>{
    if(results && results.length){
       let post = results[0];
       res.render('viewpost', {currentPost: post});
    }
    else{
      req.flash('error', 'This is not the post you are looking for!');
      res.redirect('/')
    }
  })
})

module.exports = router;
