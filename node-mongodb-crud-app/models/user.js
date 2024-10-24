const mongodb = require('mongodb')
const {getDbAccess } = require('../util/database');
const { where } = require('sequelize');
class User {
  constructor(username, email, cart, id) {
    this.username = username,
    this.email = email,
    this.cart = cart || {items:[]},  // {items: [{id:'', quantity:'' },{id:'', quantity:'' }....]}
    this._id = id ? new mongodb.ObjectId(`${id}`) : undefined
  }
  
  save() {
    let db = getDbAccess()
    return db.collection('users').insertOne(this)
  }

  static findById(userId) {
    let db = getDbAccess()
    return db.collection('users').findOne({_id: new mongodb.ObjectId(`${userId}`)})
  }

  addToCart(prodDetails) {
     const db = getDbAccess()
     const {prodId: productId , quantity} = prodDetails
     const postCartProductIndex = this.cart.items.findIndex((cp)=> cp.productId == productId)
     const updatedCartItems = [...this.cart.items]
     if (postCartProductIndex >=0) {
        updatedCartItems[postCartProductIndex].quantity += quantity
     }
     else {
       updatedCartItems.push({productId, quantity})
     }
     return db.collection('users').updateOne({_id: this._id }, 
                                             {$set: {cart: {items: [...updatedCartItems]} }} 
                                            )
  }
  
  deleteCartItem(prodId) {
    let cartItems  = [...this.cart.items].filter(ci=> ci.productId !== prodId.toString());
    console.log('cart items :', cartItems)
    const db = getDbAccess();
    return db.collection('users').updateOne( {_id: this._id}, 
                                             {$set: {cart:{items: [...cartItems]} }}
                                           )

  }
  getCart() {
    const db = getDbAccess()
    const productIds = this.cart.items.map(item=> new mongodb.ObjectId(`${item.productId}`))
    console.log('products ids :', productIds)
    return db.collection('products').find({_id: {$in:productIds}}).toArray().then(products => {
      // console.log('products :' , products)
      return products.map((product)=> {
        const index = this.cart.items.findIndex(ci=> ci.productId.toString() == product._id.toString())
        console.log('index :' ,index)
        return {
          ...product,
          quantity: this.cart.items[index].quantity
        }
      })
    })  
  }

  addOrder() {
    const db =getDbAccess();
    let orderedProducts;
    return this.getCart().then(
      products=> {
        let orderedProducts = products.map(item=> {
          return {
            _id: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          }
        })
        // console.log('order products :', orderedProducts);
        const order = {
          items: [...orderedProducts],
          user: {
            _id: this._id,
            name: this.username,
            email: this.email
          }
        }
        return db.collection('orders').insertOne(order) // [ {_id: productId, title: title, price: price, quantity: quantity}]
      }
    ).then(result=> {
       return db.collection('users').updateOne({ _id: this._id }, { $set: {cart:{items: []}} } )
    }).catch( err=> console.log(err) ); 
    
  }

  getOrders() {
    const db = getDbAccess();
    return db.collection('orders').find({'user._id': this._id}).toArray()
  }

}

module.exports = User
