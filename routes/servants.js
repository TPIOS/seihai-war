var express = require("express");
var router = express.Router();
var Servant = require("../models/servant");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Servant.find({},function(err, allServants){
        if(err){
            console.log(err);
        } else {
            res.render("servants/index", {servants: allServants});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var master = {
        id: req.user._id,
        username: req.user.username
    }
    var newServant = {name: name, image: image, description: desc, master: master};
    Servant.create(newServant, function(err, newltCreated){
        if(err){
            req.flash("error", "Something went Wrong.");
            console.log(err);
        } else {
            req.flash("success", "Successfully Summon a Good Servant.");
            res.redirect("/servants");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("servants/new"); 
});

router.get("/:id", function(req, res){
    Servant.findById(req.params.id).populate("comments").exec(function(err, foundServant){
        if(err){
            console.log(err);
        } else {
            res.render("servants/show", {servant: foundServant}); 
        }
    });
});

router.get("/:id/edit", middleware.checkServantOwnership, function(req, res){
    Servant.findById(req.params.id, function(err, foundServant){
        res.render("servants/edit", {servant: foundServant});
    });
});

router.put("/:id", middleware.checkServantOwnership, function(req, res){
   Servant.findByIdAndUpdate(req.params.id, req.body.servant, function(err, updatedServant){
      if(err){
          res.redirect("/servants");
      } else {
          req.flash("success", "You've updated the infomation successfully.");
          res.redirect("/servants/" + req.params.id); 
      }
   });
});

router.delete("/:id", middleware.checkServantOwnership, function(req, res){
   Servant.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/servants");
      } else {
          req.flash("success", "You give up the servant.")
          res.redirect("/servants");
      }
   });
});

module.exports = router;
