var Servant = require("../models/servant");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkServantOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Servant.findById(req.params.id,function(err, foundServant){
           if(err){
               req.flash("error", "Servant not Found.");
               res.redirect("back");
           } else {
               if(foundServant.master.id.equals(req.user._id)){
                    next()
               } else {
                   req.flash("error", "You don't have permission to do that.");
                   res.redirect("back");
               }
           }
        });    
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment){
           if(err){
               req.flash("error", "Comment not Found.");
               res.redirect("back");
           } else {
               if(foundComment.author.id.equals(req.user._id)){
                    next()
               } else {
                   req.flash("error", "You don't have permission to do that.");
                   res.redirect("back");
               }
           }
        }); 
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj
