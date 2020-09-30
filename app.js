var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Comment = require("./models/comment"),
  Campground = require("./models/campground"),
  User = require("./models/user"),
  seedDB = require("./seeds");

const port = process.env.PORT || 3000;
const deployDB = process.env.MONGODB_URL;
const devDB = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

mongoose
  .connect(devDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("Error:", err.message);
  });

// mongoose
//   .connect(deployDB, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log("Connected to DB!");
//   })
//   .catch((err) => {
//     console.log("Error:", err.message);
//   });

mongoose.set("useUnifiedTopology", false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// ===========================
// PASSPORT CONFIGURATION
// ===========================
app.use(
  require("express-session")({
    secret: "Alexis is the cutest among the cutest",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// create middle ware to pass currentUser on all routes
// without doing it manually
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// ===========================
// ===========================
app.listen(port, function () {
  console.log("YelpCamp Server has started...");
});
