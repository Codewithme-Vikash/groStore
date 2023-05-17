const express = require("express");
const passport = require("passport");
const { Item, User } = require("../database");
const { isAuthenticate } = require("../passportLocal");

const router = express();


router.get("/",async (req, res) => {
    try {
        const items = await Item.find().exec();
        res.render("home" , { items : items });
    } catch (err) {
        console.log(err ,  "can't not looping on items home page")
    }
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/singup", (req, res) => {
    res.render("singup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout" ,isAuthenticate, ( req , res )=>{
    req.logout( ()=>{
        req.flash("success","successfully logout!")
        res.redirect("/login")
    });
    
})
router.post("/singup", async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const user = new User({
            username: username,
            email: email,
            password: password,
        })

        await user.save();
        req.flash("success", "Your are successfully singup");
        res.redirect("/login");
    } catch (err) {
        console.log(err, "error during save the user");
        req.flash("error", "something goes wrong or username is already taken, Pleasetry again");
        res.redirect("/singup");
    }
});

router.post("/login", passport.authenticate('local',{
    failureRedirect: "/login",
    failureFlash: "invalid Creandtionals" 
}), ( req , res )=>{
    req.flash("success" , "Welocme to our online store.You are successfully login!")   ;
    res.redirect("/");
});


module.exports = router