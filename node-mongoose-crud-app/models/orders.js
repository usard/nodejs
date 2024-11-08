const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[
        {
            product:{
                type: Object,
                required: true
            },
            quantity:{
                type:Number,
                required: true
            }
        }
    ],
    user:{
        username:{
            type:String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required: true,
        }
    }
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
