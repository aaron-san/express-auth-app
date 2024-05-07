const express = require("express");
const passport = require("passport");
var router = express.Router();

const User = require("../models/user");

// Set useful variables for templates
//  Now every view will have access to currentUser, which pulls from req.user, which is populated by Passport
router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// GET home page
router.get("/", function (req, res, next) {
  User.find()
    .sort({ createAt: "descending" })
    .then((users) => {
      res.render("index", { title: "Learn about me", users: users });
    })
    .catch((err) => {
      return next(err);
    });
});

// const users = [
//   {
//     username: "Dave",
//     password: "pinpong",
//   },
// ];

// users[0].name = function () {
//   return this.username;
// };

router.get("/signup", function (req, res) {
  res.render("signup", { title: "Sign up" });
});

// Signup page
router.post(
  "/signup",
  async function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    // console.log(username, password);
    try {
      const user = await User.findOne({ username: username });
      // console.log("Existing user: " + user);
      // If the user already exists flash an error message and redirect
      if (user) {
        req.flash("error", "User already exists");
        return res.redirect("/signup");
      }

      // Create a new instance of the User model with the username and password
      const newUser = new User({
        username: username,
        password: password,
      });
      // console.log(newUser);
      // Save the user to the database and continue to the next request handler
      await newUser.save();
      // console.log(result);
      // res.redirect("/");
      next();
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  },
  // Applies the nameed strategy (or strategies) to the incoming request, in order to authenticate the request. If authentication is successful, the user will be logged in and populated at req.user and a session will be established by default. If authentication fails, an unauthorized response will be sent.
  // Authenticate the user
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

// Login page
router.get("/login", function (req, res) {
  res.render("login", { title: "Log in" });
});

router.post(
  "/login",
  // Return a request handler function with redirect and message options
  // Authenticates requests.
  // Applies the nameed strategy (or strategies) to the incoming request, in order to authenticate the request. If authentication is successful, the user will be logged in and populated at req.user and a session will be established by default. If authentication fails, an unauthorized response will be sent.
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    // Set an error message with connect-flash if the user fails to log in
    failureFlash: true,
  })
);

// Edit page
// Ensure that the user is authenticated, then run the request handler if they haven't been redirected
// The middleware is placed before the request handler
router.get("/edit", ensureAuthenticated, function (req, res) {
  res.render("edit", { title: "Edit your profile" });
});

// Normally, this would be a PUT request, but browsers support only GET and POST in HTML forms
router.post("/edit", ensureAuthenticated, function (req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user
    .save()
    .then(function () {
      req.flash("info", "Profile updated!");
      res.redirect("/edit");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// Log out
router.get("/logout", function (req, res) {
  // logout() is a function provided by Passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Profile page
router.get("/users/:username", async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return next(404);
    }
    res.render("profile", { title: "My profile", user: user });
  } catch (err) {
    return next(err);
  }
});

function ensureAuthenticated(req, res, next) {
  // A function provided by Passport
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}
// });

module.exports = router;
