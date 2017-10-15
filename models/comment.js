var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    //author is comprised of _id, username and hash
    //we save only the _id and username without password hash
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);