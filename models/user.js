const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: {
    type: String,
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String,
});

// Don't want to save actual password in the database - it could get hacked
// Apply a one-way hash to the password using the bcrypt algorithm
// Bcrypt runs a part of the algorithm many times to produce a secure hash, but that number is configurable. The higher the number, the more secure, but the slower it takes.
// Define a pre-save action that will hash the password before it is saved to the database via user.save()
// This function creates a hash for the plain password and overwrites the model's password value
userSchema.pre("save", function (done) {
  var user = this;

  // Skip if the password is unchanged
  if (!user.isModified("password")) {
    return done();
  }

  // Apply a one-way hash to the password with bcrypt
  bcrypt
    .hash(user.password, SALT_FACTOR)
    .then((hash) => {
      // Overwrite plain password
      user.password = hash;
      done();
    })
    .catch((err) => console.log(err.message));
});

// Add a method to get the user's name (if displayName is undefined, return username)
userSchema.methods.name = function () {
  return this.displayName || this.username;
};

userSchema.methods.checkPassword = function (guess, done) {
  console.log(guess, this.password);
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    // Return error, if any, or whether there is a match
    done(err, isMatch);
  });
};

userSchema.methods.name = function () {
  return this.displayName || this.username;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
