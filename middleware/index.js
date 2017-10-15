var Campground = require("../models/campground"),
    Comment    = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //check if user is logged in
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
        //does the user own the campground or is an admin?
                    if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){ // .equals(argument) method is given by mongoose
                    //send campground details so we get the details auto-populated and have what to edit
                    next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                    
                }
            });
        } else {
            res.redirect("back");
        }
            //otherwise redirect
        //if not, redirect
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
    //does the user own the comment or is an admin?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){ // .equals(argument) method is given by mongoose
                //send campground details so we get the details auto-populated and have what to edit
                next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You are not logged in to do this");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;