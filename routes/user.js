const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.get("/signup",userController.signupform );

router.post("/signup", wrapAsync( userController.signup));

router.get("/login", userController.loginform);

router.post("/login", saveRedirectUrl,
     passport.authenticate("local", {   failureRedirect: "/login",failureFlash: true,}),
      userController.login);

router.get("/logout", userController.logout);

module.exports = router;

