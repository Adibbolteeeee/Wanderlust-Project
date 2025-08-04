const User = require("../models/user.js");

module.exports.renderSignupPage = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async(req,res) => {
    try {
        let {email, username, password} = req.body;
        let newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err) {
                next(err);
            }
            else {
                req.flash("success","User registered successfully");
                res.redirect("/listings");
            }
        });
    } catch(e) { //If user is already registered
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginPage = (req,res) => {
    res.render("users/login.ejs")
};

module.exports.loginUser = async(req,res) => {
        let redirectUrl = res.locals.redirectUrl || "/listings";
        req.flash("success","User logged in successfully");
        res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
       req.flash("success","You are now logged out!");
       res.redirect("/login");
    });
};