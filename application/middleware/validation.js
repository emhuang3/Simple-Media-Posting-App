const checkUsername = (username) =>{
    /**
     * Regex
     * ^ --> start of the string
     * D --> anything NOT a digit [^0-9]
     * \w anything that is a alphanumeric character [a-z0-9]
     * {2,} --> 2 or more characters w/ NO UPPER LIMIT
     */
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
     
}

const checkPassword = (password) =>{
    let passwordChecker = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[(\-+!@#\$\^&\*])(?=.{8,})/;
    return passwordChecker.test(password);

}

const checkEmail = (email) =>{
     let emailChecker = /@/;
     return emailChecker.test(email);
}

const registerValidator = (req, res, next) =>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    if(!checkUsername(username) || !checkEmail(email) || !checkPassword(password)){
        req.flash('error', 'Invalid username or password or email');
        req.session.save(err=>{
            res.redirect("/registration");
        });
    }else{
        next();
    }
}

const loginValidator = (req, res, next) =>{
    let username = req.body.username;
    let password = req.body.password;
    if(!checkUsername(username) || !checkPassword(password)){
        req.flash('error', "Invalid username and/or password");
        req.session.save(err=>{
            res.redirect("/login");
        })
    }else{
        next();
    }

}


module.exports = {registerValidator, loginValidator};