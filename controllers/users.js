const userModel = require("../models/users");

module.exports.renderRegister = (request, response) => {
      response.render("register");
};

module.exports.registerUser = async (request, response) => {
      try {
            const { username, email, password } = request.body;
            const newUser = new userModel({ username, email });
            const registeredUser = await userModel.register(newUser, password);
            request.login(registeredUser, (error) => {
                  if (error) {
                        next(error);
                  }
                  request.flash("success", "yayyy registered succesfully");
                  response.redirect("/campgrounds");
            });
      } catch (error) {
            request.flash("error", error.message);
            response.redirect("/register");
      }
};

module.exports.renderLogin = (request, response) => {
      response.render("login");
};

module.exports.loginUser = (request, response) => {
      const returnTo = response.locals.returnTo || "/campgrounds";
      request.flash("success", "welcome back");
      delete response.locals.returnTo;
      response.redirect(returnTo);
};

module.exports.logoutUser = (request, response) => {
      request.logout(function (err) {
            if (err) {
                  return next(err);
            }
            request.flash("success", "Goodbye!");
            response.redirect("/campgrounds");
      });
};
