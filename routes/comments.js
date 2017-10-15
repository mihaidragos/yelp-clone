var express     = require("express"),
    router      = express.Router({mergeParams: true}), //the mergeParams merges all the params from the Campground and Comment files so that it finds the req.params.id
    //require the models/campground.js and models/comment.js files
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");
    
    
//=============================================
//      COMMENTS ROUTES    | NESTED ROUTES
//=============================================

// Comments New
router.get("/new", middleware.isLoggedIn,function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            //render the comments/new.ejs with the found campground as the campground variable
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments Create
// Added isLoggedIn middleware function to check if user is logged in when commenting
router.post("/", middleware.isLoggedIn,function(req, res){
    //lookup campgrounds using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
        //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
        //connect new comment to campground by pushing it into the array
                    campground.comments.push(comment);
                    campground.save();
            //show flash message for success
                    req.flash("error", "Successfully added comment");
        //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // res.send('aslkalakjg;lag;skgsg')
    //finds and update correct comment
    // findByIdAndUpdate takes 3 arguments: 1-id to find by, 2-data to update it with, 3-callback to run
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            res.redirect("back");
            console.log(err);
        } else {
    // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
});

// Destroy/Delete Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
