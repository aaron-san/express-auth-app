require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
// const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const setUpPassport = require("./setuppassport");

var app = express();

setUpPassport();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Concise output colored by response status for development use.
app.use(logger("dev"));
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option (makes the parsing simpler and more secure)
// Adds the form input values (assigned by name) to req.body
// E.g., <input type="text" name="username" /> --> access via req.body.username
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Middleware that serves static files
app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    // Secret needs to be a bunch of random characters
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
// Intializes Passport for incoming requests, allowing authentication strategies to be applied.
app.use(passport.initialize());
// Middleware that will restore login state from a session.
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// mongoose.connect("mongodb://127.0.0.1:27017/test");
// mongoose.connect("mongodb://127.0.0.1:27017/stock_data", {

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

module.exports = app;
