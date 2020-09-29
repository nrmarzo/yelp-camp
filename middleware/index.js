// all the middleware goes here

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  // check if user logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // check if current user owns the campground
        // (.equals is used because foundCampground.author.id is a string, and req.user._id is an object)

        if (foundCampground.author.id.equals(req.user._id)) {
          // move on to the rest of the code (after middleware)
          next();
        } else {
          // otherwise, redirect
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    // if not, redirect
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // check if user logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // check if current user owns the comment
        // (.equals is used because foundComment.author.id is a string, and req.user._id is an object)

        if (foundComment.author.id.equals(req.user._id)) {
          // move on to the rest of the code (after middleware)
          next();
        } else {
          // otherwise, redirect
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    // if not, redirect
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
