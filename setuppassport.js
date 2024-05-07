// This project uses a "local strategy" for authentication (via MongoDB and Mongoose)

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

module.exports = function () {
  // Turn a user object into an ID.
  passport.serializeUser(function (user, done) {
    // Call done() with no error and the user's ID.
    done(null, user._id);
  });
  // Turn an ID  into a user object
  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });

  // Tell Passport to use a local strategy
  passport.use(
    "login",
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "No user has that username!" });
          }
          user.checkPassword(password, function (err, isMatch) {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid password." });
            }
          });
        })
        .catch((err) => {
          console.log(err.message);
          return done(err);
        });
    })
  );
};
