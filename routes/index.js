var express     = require("express"),
    router      = express.Router(),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    User        = require("../models/user");
    

// LANDING Page
router.get("/", function(req, res){
    res.render("landing");
});

//=============================================
//            AUTHENTICATION ROUTES  
//=============================================

// Show Register Form
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// Handle Sign Up Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "codsecret123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// Handles LOGIN Logic
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//LOGOUT Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;