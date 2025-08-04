const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup page in signup user
router.route("/signup")
.get(userController.renderSignupPage)
.post(wrapAsync(userController.signupUser));


//login page & login user
router.route("/login")
.get(userController.renderLoginPage)
.post(
    saveRedirectUrl,
    passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
    }),
    userController.loginUser
);

router.get("/logout",userController.logoutUser);


module.exports = router;