var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Servant         = require("./models/servant"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

var commentRoutes = require("./routes/comments"),
    servantRoutes = require("./routes/servants"),
    indexRoutes   = require("./routes/index");

// mongoose.connect("mongodb://localhost/seihai_war");
mongoose.connect("mongodb://tpios:password@ds133932.mlab.com:33932/seihai_war");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.Promise = global.Promise;
//seedDB();

app.use(require("express-session")({
    secret: "Emiya is Archer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/servants", servantRoutes);
app.use("/servants/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!"); 
});
