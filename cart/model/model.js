const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        userID : {
            type : String
        },
        grandTotal : {
           type: Number 
        },
        products : [{
            productID: {
                type : String
            },
            productName : {
                type : String
            },
            quantity : {
                type : Number
            },
            subTotal : {
                type : Number
            }
        }],
    }, { versionKey: false }
)

module.exports = mongoose.model("Cart", cartSchema)