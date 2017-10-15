//require mongoose
var mongoose = require("mongoose");
// require Campground
var Campground = require("./models/campground");
// require comment model/schema
var Comment = require("./models/comment");


var data = [
   {
     name: "Salmon Creek", 
     image: "https://www.visitnc.com/resimg.php/imgcrop/2/52908/image/800/448/KerrCamping.jpg",
     description: "Utinam alienum mea no, cum et quaeque accusamus. Et iusto aperiri sea, qui sumo vero ei. Ut libris semper discere mea, quo ut labores volutpat delicatissimi, no idque lobortis persequeris mea. Sit rebum perfecto an",
   },
   {
     name: "Mountain peak", 
     image: "http://www.visitnc.com/contents/imgcrop/60726/1200/630/preview",
     description: "Atqui voluptatum quo et, partem repudiare sea ad. Delicata mediocritatem vim in. Summo saperet alienum et mel, vide minimum ex quo. Id mea tempor facilisis democritum.",
   },
   {
     name: "Goat's rest", 
     image: "http://www.trend-chaser.com/wp-content/uploads/sites/7/2016/11/featured-image-6.jpg",
     description: "Lorem ipsum dolor sit amet, voluptatum comprehensam eam in, sed eius veniam cu, tollit hendrerit reprimique cu qui. Ut per soluta viderer habemus. Per ea habeo legere facilisis, illud phaedrum maluisset per te. Usu choro aperiri in, tota contentiones qui ex. Melius imperdiet evertitur vix no, ei aperiam persequeris duo, has omnium fabulas te. Porro voluptua eu sed, an vis suas homero reprehendunt, verterem legendos at quo. Qui alii accusamus interesset id, an fuisset conceptam pri, eam eu veniam soluta sing",
   }
];

function seedDB(){
    Campground.remove({}, function(err){ // Remove campgrounds
            if(err){
              console.log(err);
            } else {
            console.log("removed campgrounds");}
            // add a few campgrounds by looping through data and adding each one 
            // add the campgrounds after the removing has been made / as a callback
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                      console.log(err);
                    } else {
                        console.log("added a campground");
                        // create a comment on each campground
                        Comment.create(
                            {
                              text: "Utinam alienum mea no, cum et quaeque accusamus. Et iusto aperiri sea, qui sumo vero ei. Ut libris semper discere mea, quo ut labores volutpat delicatissimi, no idque lobortis persequeris mea. Sit rebum perfecto an.",
                              author: "Homer Simpson"
                            }, function(err, comment){
                                //check for errors
                                if(err){
                                    console.log(err);
                                } else {
                                // associate it with the campground / push it into the array on the campground
                                    campground.comments.push(comment);
                                    campground.save(); //save campground
                                    console.log("created new comment");
                                }
                        });
                    }
                });
            });
    });
}

// send previous function out and be stored under seedDB
module.exports = seedDB;
