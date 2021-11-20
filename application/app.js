const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const app = express();
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);




//const port = 3000;
//const cors = require('cors');
 
// app.use(cors());
// app.use(express.json())

// // app.get('/', (req,res)=>{
// //   db.query('select 1+1', function(error, results, fields){
// //     if(error){
// //       res.json(error);
// //     }
// //     else{
// //       res.json(results);
// //     } 
// //   });
// // });

// app.get('/', (req,res)=>{
//   db.query('select 1+1')
//   .then(([results, fields])=>{
//     res.json(results)
//   })
//   .catch(err => res.json(err))
// });

// app.get('/users', (req, res)=>{
//   db.query("select * from users")
//   .then(([results, fields])=>{
//     res.json(results)
//   })
//   .catch( err => res.json(err))
// });

// app.get('/posts', (req, res)=>{
//   db.query("select * from posts")
//   .then(([results, fields])=>{
//     res.json(results)
//   })
//   .catch(err => res.json(err))
// });

// app.get("/posts/:id", (req, res)=>{
//   let _id = req.params.id;
//   db.query("select * from posts where id=?", [_id])
//   .then(([results, fields])=>{
//     res.json(results)
//   })
//   .catch(err => res.json(err))
// });

// app.post("/posts", async (req, res)=>{
//   let {title, authorId} = req.body;
//   try{
//     let[results, fields] = await db.query("INSERT INTO posts (title, authorId) VALUES (?,?)", [title, authorId]);
//     res.json(resulsts)
//   } catch(error){
//     res.json(error);
//   }
// });


// app.listen(port, ()=>{
//   console.log(`Listening on http://localhost:${port}...`);
// })

// // let baseSQL = `SELECT title, username
// // FROM posts as p 
// // JOIN  users as u
// // ON p.authorId=u.id
// // WHERE u.id=?;
// // `

// // db.query(
// //   baseSQL,
// //   [9],
// //   // "INSERT INTO users (username, email, avatar, createdAt) VALUE (?,?,?,now())", 
// //   // ["test1234", "test1234@mail.com", "noavatar"], 
// //   function(err, results, fields){
// //     if(err){
// //         console.error(err);
// //     }else{
// //       console.log(results);
// //       //results.forEach(row => console.log(row));
// //       //console.log(fields);
// //     }
// //     db.end();
// // });

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {}, //adding new helpers to handlebars for extra functionality
  })
);

var mysqlSessionStore = new mysqlSession({/*using default options*/}, require('./conf/database'));

app.use(sessions({
  key: "csid",
  secret: "this is a secret from csc317",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next)=>{
  //console.log(req.session);
  if(req.session.username){
    res.locals.logged = true;
  }
  next();
})


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));


app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js

// app.use((req, res, next)=>{
//   if(req.session.username){
//     res.locals.logged = true;
//   }
//   next();
// })

/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})
  

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
