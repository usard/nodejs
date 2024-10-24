const mongoose = require('mongoose');

const Schema =   mongoose.Schema;

const userSchema =  new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
                  {
                    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true}, 
                    quantity:  { type: Number, required: true}
                  }
               ]
    }  
})

userSchema.methods.addToCart = function (product) {
    console.log('product id :', product )
    const cartProductIndex = this.cart.items.findIndex(cp=> cp.productId.toString() === product.prodId.toString())
    if (cartProductIndex < 0) {
        this.cart.items.push({productId: product.prodId, quantity: product.quantity})
    }
    else {
       this.cart.items[cartProductIndex].quantity += product.quantity;
    }
    return this.save()
}

// userSchema.methods.getCart = function () {
//     return this.cart.items
// }


const User = mongoose.model('User', userSchema)

module.exports = User;