var mongoose = require("mongoose"); //adds mongoose
//connect to the yelp_camp database
mongoose.connect("mongodb://localhost/yelp_camp_v10", { useMongoClient: true }); 

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // Associate comments with a campground by adding this comments property to the campground model
    comments: [ //is an array of comment IDs
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" //the name of the model
        }
    ]
});

//compiling the Schema to a MODEL / OBJECT
module.exports = mongoose.model("Campground", campgroundSchema);