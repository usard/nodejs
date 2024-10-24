const mongodb = require('mongodb');
const {getDbAccess} = require('../util/database')
class Product {
  constructor(title, price,imageUrl,description, id=undefined, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description
    // this._id = id 
    this._id = id? new mongodb.ObjectId(`${id}`): id 
    this.userId = userId
  }

  save() {
    const db = getDbAccess();
    if(this._id) {
      return db.collection('products').updateOne(
        // {_id: new mongodb.ObjectId(`${this._id}`)}, 
        // {$set: {title: this.title, price: this.price, imageUrl: this.imageUrl, description: this.description}}
           {_id: this._id}, {$set: this}
          )
      }
    return db.collection('products').insertOne(this)
  }

  static fetchAll() {
    const db = getDbAccess()
    return db.collection('products').find().toArray()
  }

  static findById(id) {
    const db = getDbAccess();
    // return db.collection('products').find({_id: new mongodb.ObjectId(`${id}`)}).toArray()
    return db.collection('products').findOne({_id: new mongodb.ObjectId(`${id}`)})
  }

  static deleteById(id){
    const db = getDbAccess();
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(`${id}`)})
  }
}
module.exports = Product;