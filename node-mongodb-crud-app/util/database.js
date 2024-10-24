// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

const   {MongoClient, MongoOIDCError} = require('mongodb');

const uri = `mongodb+srv://umasaianvesh:rcYZ1vvfov0EPFeF@cluster0.fiavvsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(uri)

let _db; // internal variable to this file

const mongoConnect = (callback) => {
  client.connect()
  .then(client=> {
    console.log('connected');
    _db = client.db('shop');
    callback();
  })
  .catch(err=> { 
      console.log(err); 
      throw new Error("error while connecting to database");
  })
}

const getDbAccess = () => {
  if(_db) return _db;
  throw new Error("no database found"); 
}

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDbAccess = getDbAccess;
