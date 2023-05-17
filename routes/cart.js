const express = require("express");
const { Item, User } = require("../database");
const router = express();


// API's - endspoints for '/mycart'
router.get("/", async (req, res) => {

    try {
        const user = await User.findById(req.user.id).populate("carts.item").exec();
        res.render("cart", { items: user.carts });
    } catch (err) {
        console.log(err)
        req.flash("error", "something wrong, my cart is not loaded!")
        res.redirect("/")
    }

});

router.post("/add/:id", async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $push: {
                carts: {
                    item: req.params.id,
                    quantity: req.body.quantity,
                }
            }
        }).exec();
        
        req.flash("success", "Product successfully added to your Cart");
        res.redirect("/mycart");
    } catch (err) {
        req.flash("error", "couldn't not added the item to cart");
        res.redirect("/");
    }

});

router.get("/remove/:cartElementId", async (req, res) => {
    
    try {
        const user = await User.findByIdAndUpdate( req.user.id , { $pull : {
            carts : { uniqueId : req.params.cartElementId }
        }});
        
        
        res.redirect("/mycart");

    } catch (err) {
        console.log(err,'kjs')
        req.flash("error"," during delete cart element");
        res.render("/mycart");
    }
});





module.exports = router;