var mongoose = require("mongoose");

var servantSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   master: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   },
   comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }   
    ]
});

module.exports = mongoose.model("Servant", servantSchema);
