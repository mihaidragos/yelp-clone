var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"), //if we require a directory it requires index.js file in that directory
    geocoder    = require("geocoder");

//INDEX @ RESTful - Show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){ // Schema Object has methods to interact with
        if(err){
            console.log(err);
        } else {
            //send the found campgrounds as the campgrounds var in the index.ejs file
            // then send the user that is logged in to the index.ejs file
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
        }
    });
});


//CREATE @ RESTful - add new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if(err){
            console.log(err);
            return res.redirect("back", {"error": err.message});
        } else if (data.results[0] !== undefined){
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
            // Create new campground and save to DB
            Campground.create(newCampground, function(err, newlyCreated){ //Another method on the Schema Obj
                if(err){
                    console.log(err);
                } else {
                    //redirect to campgrounds page
                    console.log(newlyCreated);
                    res.redirect("/campgrounds"); //redirect is default a GET request
                }
            });
        } else {
            req.flash("error", "That is not a valid location");
            res.redirect("back");
        }
    });
});

//NEW @ RESTful - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW @ RESTful - Shows more info about a campground
router.get("/:id", function(req, res) {
    // find the campground with provided ID and populate the comments array so it can be displayed on the SHOW page
    // and is not only IDs
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ // (id, callback)
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "You don't have permission to do that");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if(err){
            req.flash("error", "Oops Something Went Wrong!");
            res.redirect("back");
        // } else if (data.results[0] == undefined || data.results[0] == null){
        //     req.flash("error", "Oops Something Went Wrong!");
        //     res.redirect("back");
        //     // res.redirect("back", {"error": "Oops Something Went Wrong!"});
        } else if(data.results[0] !== undefined){
            console.log(data.results);
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newData = {name: name, image: image, description: desc, price: price, author: author, location: location, lat: lat, lng: lng};
    
            //finds and update correct campground
            Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
            // redirect to show page
                    req.flash("success", "Successfully Updated Campground");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        } else {
            req.flash("error", "That is not a valid location");
            res.redirect("back");
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
