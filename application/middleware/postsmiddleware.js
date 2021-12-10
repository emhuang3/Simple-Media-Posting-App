const PostModel = require("../models/Posts");
//var db = require("../models/Posts");
const postMiddleware = {};

postMiddleware.getRecentPosts = async function(req, res, next){
    try{
        let results = await PostModel.getNRecentPosts(8);
        res.locals.results = results;
        if(results.length == 0){
            req.flash('error', 'There are no posts created yet.');
        }
        next();
    }catch(err){
        next(err)
    }

    // let baseSQL = 'SELECT id, title, description, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8';
    // db.execute(baseSQL, [])
    // .then(([results, fields])=>{
    //     res.locals.results = results;
    //     if(results && results.length == 0){
    //         req.flash('error', 'There are no posts created yet.');
    //     }
    //     next();
    // })
    // .catch((err)=>next(err));
}

module.exports = postMiddleware;