var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"), //adds mongoose
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    // after making models dir and adding the campgrounds schema in a file which exports it (module.exports)
    Campground          = require("./models/campground"), // "./" means it's in the same dir as this file
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    // seedDB              = require("./seeds"),
//require the routes files
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
    console.log(process.env.DATABASEURL);

//connect to the yelp_camp database
// mongoose.connect("mongodb://localhost/yelp_camp_v10", { useMongoClient: true }); 
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true }); 

// use body parser
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the DB at the beginning
// seedDB(); //seed the database


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Orice vrei tu aici!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to add moment js for time since created
app.locals.moment = require("moment");

//To add {currentUser: req.user} to all routes as is in the INDEX page
app.use(function(req, res, next){
    res.locals.currentUser = req.user;                       
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Tell express to use the Routes required at top
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Yelp Camp Server v13 has started!");
}); 


