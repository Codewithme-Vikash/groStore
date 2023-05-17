const mongoose = require("mongoose");



exports.mongooseConnect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/gocceryStore")
        .then((res) => { console.log("successfully connected to mongodb") })
        .catch((err) => { console.log(err, "cann't connect to mongodb") });
};

const cartSchema = mongoose.Schema(
    {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        quantity: Number,
        uniqueId : { 
            type : String,
            default : function(){
                return new mongoose.Types.ObjectId().toString()
            },
            unique : true
         }
    },
    { _id: false }
);

const itemSchema = mongoose.Schema({
    product: String,
    description: String,
    realprice: Number,
    fakeprice: Number
});

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    carts: [cartSchema],
},
    {
        timestamps: true
    },
);

exports.Item = mongoose.model("Item", itemSchema);
exports.User = mongoose.model("User", userSchema);