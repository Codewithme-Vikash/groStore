const express = require("express");

const { Item, User } = require("../database");


const router = express();


// API's - '/admin' endpoints
router.get("/",async (req, res) => {
    try {
        
        const items = await Item.find().exec();
        res.render("admin",{ items : items });
    } catch (error) {
        
    }

});

router.post("/items/add", async (req, res) => {

    try {
        const { product, description, fakeprice, realprice } = req.body;
        const item = new Item({
            product: product,
            description: description,
            fakeprice: fakeprice,
            realprice: realprice
        });
        item.save();
        req.flash("success", "item add successfully");
        res.redirect("/admin");
    } catch (err) {
        req.flash("error", "couldn't add item ");
        res.redirect("/admin");
    }


});

router.get("/items/delete/:id" , async( req ,res )=>{
    
    try {
        const item = await Item.findByIdAndDelete( req.params.id ).exec();
        const users = await User.find({"carts.item" : item }).exec();
        
        for( let user of users){
            const del = await User.findByIdAndUpdate( user.id , {$pull : {
                carts  : { item : item}
            }}).exec();
        };
        req.flash("success","item is successfully deleted!");
        res.redirect("/admin")
    } catch (err) {
        req.flash("error","couldn't not deleted item");
        res.redirect("/admin");
    }
});

router.get("/items/edit/:id" , async ( req , res)=>{

    try {
        const item = await Item.findById( req.params.id ).exec();
        res.render("adminEdit" , { item : item });
    } catch (err) {
        req.flash("error","error during render the adminEdit page or Item.findById()");
        res.redirect("/admin");
    }
});

router.post("/items/edit/:id",async( req , res)=>{
    try {
        await Item.findByIdAndUpdate( req.params.id , { 
            product : req.body.product,
            description : req.body.description,
            fakeprice : req.body.fakeprice,
            realprice: req.body.realprice
        })

        req.flash("success","item is successfully edited!");
        res.redirect("/admin");
    } catch (err) {
        req.flash("error","couldn't edit item");
        res.redirect("/admin");
    }
})

module.exports = router;