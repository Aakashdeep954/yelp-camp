if (process.env.NODE_ENV != "production") {
      require("dotenv").config();
}
console.log(process.env.cloud_name);
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const campGroundModel = require("./models/campGrounds");
const reviewModel = require("./models/reviews");
const userModel = require("./models/users");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const campGroundsRouter = require("./routes/campGrounds");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");
const passport = require("passport");
const localStrategy = require("passport-local");

mongoose
      .connect("mongodb://127.0.0.1:27017/campgrounds")
      .then(() => {
            console.log("connected to mongodb");
      })
      .catch((e) => {
            console.log(e);
      });

app.use(
      session({
            secret: "firstTime",
            resave: false,
            saveUninitialized: false,
            cookie: {
                  httpOnly: true,
                  expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
                  maxAge: 1000 * 60 * 60 * 24 * 7,
            },
      })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname) + "/views");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use((request, response, next) => {
      response.locals.success = request.flash("success");
      response.locals.error = request.flash("error");
      response.locals.currentUser = request.user;
      next();
});

app.get("/", (request, response) => {
      response.render("home");
});
app.use("/", usersRouter);
app.use("/campgrounds", campGroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.use((error, request, response, next) => {
      response.render("error", { error });
});

const port = process.env.port || 3000;
app.listen(port, () => {
      console.log("connected");
});

app.get("/cookie", (request, response) => {
      // if (request.session.count == undefined) {
      //       request.session.count = 0;
      // } else {
      //       request.session.count++;
      // }

      console.log(request.sessionID);
      request.session.count = 0;
      response.send("hello there");
});
