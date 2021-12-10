var express = require('express');
var router = express.Router();
var db = require('../conf/database')
const UserModel = require("../models/Users")
const UserError = require("../helpers/error/UserError");
const { requestPrint, errorPrint, successPrint} = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');      
const {registerValidator, loginValidator} = require('../middleware/validation');                                                                                                           
//const e = require('express');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//router.use('/register', registerValidator);
router.post('/register', registerValidator, (req, res, next)=>{
  // console.log(req.body);
  // res.send('data');
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password2;
  /*
    Do server side validation
  */

  // res.json({
  //   message: "Valid user"
  // });

  UserModel.usernameExists(username)
  .then((usernameDoesExist)=>{
    if(usernameDoesExist){
      throw new UserError("Registration Failed. Username already exists.", "/registration", 200);
    }else{
      return UserModel.emailExists(email);
    }
  })
  .then((emailDoesExist)=>{
    if(emailDoesExist){
      throw new UserError("Registration Failed. Email already exists.", "/registration", 200);
    }else{
      return UserModel.create(username, password, email);
    }
  })
  .then((createdUserId)=>{
    if(createdUserId<0){
      throw new UserError("Server Error, user could not be created.", "/registration", 500);
    }else{
      successPrint("User was created.");
      req.flash('success', 'User account has been made!');
      res.redirect("/login");
    }
  })
  .catch((err)=>{
    errorPrint("User could not be made", err);
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }else{
      next(err);
    }
  });

  // db.execute("SELECT * FROM users WHERE username=?", [username])
  // .then(([results, fields]) => {
  //   if(results && results.length == 0){
  //     return db.execute("SELECT * FROM users WHERE email=?", [email]);
  //   }else{
  //     throw new UserError(
  //       "Registration Failed: Username already exists",
  //       "registration",
  //       200
  //     );
  //   }

  // })
  // .then(([results, fields])=>{
  //   if(results && results.length == 0){
  //     return bcrypt.hash(password, 15);
  //   }else{
  //     throw new UserError(
  //       "Registration Failed: Email already exists",
  //       "registration",
  //       200
  //     );
  //   }
  // })
  // .then((hashedPassword)=>{
  //   //if(results && results.length == 0){
  //     let baseSQL = "INSERT INTO users (username, email, password, createdAt) VALUES (?,?,?,now());";
  //     return db.execute(baseSQL, [username, email, hashedPassword])
  //   // }else{
  //   //   throw new UserError(
  //   //     "Registration Failed: Email already exists",
  //   //     "registration",
  //   //     200
  //   //   );
  //   // }
  // })
  // .then(([results, fields])=> {
  //   if(results && results.affectedRows){
  //     successPrint("User.js --> User was created!");
  //     req.flash('success', 'User account has been made!');
  //     res.redirect('/login');
  //   }else{
  //     throw new UserError(
  //       "Server Error, user could not be created",
  //       "registration",
  //       500
  //     );
  //   }
  // })
  // .catch((err)=>{
  //   errorPrint("User could not  be made", err);
  //   if(err instanceof UserError){
  //      errorPrint(err.getMessage());
  //      req.flash('error', err.getMessage());
  //      res.status(err.getStatus());
  //      res.redirect(err.getRedirectURL());
  //   }else{
  //     next(err);
  //   }
  // });
})


router.post('/login', loginValidator, (req, res, next)=>{
  let username = req.body.username;
  let password = req.body.password;

  /**
   * Do server validation here
   */

  //  res.json({
  //   message: "Valid login"
  // });

UserModel.authenticate(username, password)
  .then((loggedUserId)=>{
    if(loggedUserId > 0){
      successPrint(`User ${username} is logged in`)
      req.session.username = username;
      req.session.userId = loggedUserId;
      req.flash('success', 'You have been successfully logged in!');
      res.redirect('/');
    }else{
      throw new UserError("Invalid username or password", "/login", 200);
    }
  })
  .catch((err)=>{
    errorPrint("User login failed");
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect('/login')
    }else{
      next(err);
    }
  })


  // let baseSQL = "SELECT id, username, password FROM users WHERE username =?;"
  // let userId;
  // db.execute(baseSQL, [username])
  // .then(([results, fields]) => {
  //   if(results && results.length == 1){
  //     let hashedPassword = results[0].password;
  //     userId = results[0].id;
  //     return bcrypt.compare(password, hashedPassword);
  //   }else{
  //     throw new UserError("invalid username or password", "/login", 200);
  //   }
  // })
  // .then((passwordsMatched)=>{
  //   if(passwordsMatched){
  //     successPrint(`User ${username} is logged in`)
  //     req.session.username = username;
  //     req.session.userId = userId;
  //     req.flash('success', 'You have been successfully logged in!');
  //     res.redirect('/');
  //   }else{
  //     throw new UserError("Invalid username or password", "/login", 200);
  //   }
  // })
  // .catch((err)=>{
  //   errorPrint("User login failed");
  //   if(err instanceof UserError){
  //     errorPrint(err.getMessage());
  //     req.flash('error', err.getMessage());
  //     res.status(err.getStatus());
  //     res.redirect('/login')
  //   }else{
  //     next(err);
  //   }
  // })

})

router.post('/logout', (req, res, next)=>{
  req.session.destroy((err)=>{
    if(err){
      errorPrint("Session could not be destroyed.");
      next(err);
    }else{
      successPrint("Session was destroyed");
      res.clearCookie('csaid');
      res.json({status: "OK", message: "user is logged out"});
    }
  });
})
module.exports = router;


