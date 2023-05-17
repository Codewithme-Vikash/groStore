const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

const { mongooseConnect } = require("./database");
const { passportStrategy , isAuthenticate ,isSuperUser } = require("./passportLocal");

// routeres
const homeRouter = require("./routes/home");
const cartRouter = require("./routes/cart");
const adminRouter = require("./routes/admin");

// create a app of express
const app = express();

// connect to database
mongooseConnect();

// middlewares
app.use(express.static("public"));
app.use( bodyParser.urlencoded( { extended : true }));
app.set( "view engine" , "ejs");
app.use( session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : false,
}));
app.use( passport.initialize() );
app.use( passport.authenticate("session"));
app.use(flash())

app.use( (req , res , next )=>{
    res.locals.messages = req.flash();
    next();
});

app.use( (req , res , next)=>{
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user = req.user;
    next();
} )

// passport local stragety
passportStrategy(passport);

// router API's
app.use("/",homeRouter);
app.use("/mycart",isAuthenticate, cartRouter);
app.use("/admin",isAuthenticate , isSuperUser ,  adminRouter);



app.listen( 3000  , ( req , res ) => {
    console.log("website is running on port 3000");
});