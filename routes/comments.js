var express = require("express");
var router = express.Router({mergeParams: true});
var Servant = require("../models/servant");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Servant.findById(req.params.id, function(err, servant){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {servant: servant});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
   Servant.findById(req.params.id, function(err, servant){
      if(err){
          console.log(err);
          res.redirect("/servants");
      } else {
          Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went Wrong.");
                console.log(err);
            } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
            
                servant.comments.push(comment);
                servant.save();
                req.flash("success", "Successfully added the comment");
                res.redirect("/servants/"+servant._id);
            }
          });
      }
   });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {servant_id: req.params.id, comment: foundComment});
       }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "You've updated the comment successfully.");
            res.redirect("/servants/" + req.params.id);
        }
     });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "You deleted the comment.")
          res.redirect("/servants/" + req.params.id);
      }
   });
});

module.exports = router;
