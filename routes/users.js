const express = require("express");
const userModel = require("../models/users");
const passport = require("passport");
const { resolveInclude } = require("ejs");
const router = express.Router();
const { storeReturnTo } = require("../middleware");
const usersController = require("../controllers/users");

router.route("/register")
      .get(usersController.renderRegister)
      .post(usersController.registerUser);

router.route("/login")
      .get(usersController.renderLogin)
      .post(
            storeReturnTo,
            passport.authenticate("local", {
                  failureFlash: true,
                  failureRedirect: "/login",
            }),
            usersController.loginUser
      );

router.get("/logout", usersController.logoutUser);

module.exports = router;
