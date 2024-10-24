const path = require('path');
const User = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');

const {mongoConnect } = require('./util/database');

const errorController = require('./controllers/error');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
 User.findById('66ff33bf2512c9636ef0355f').then((user)=> {
  // console.log('default user :', user)
  req.user = new User(user.username, user.email, user.cart, user._id);
  next()
 }).catch(err=> {
    console.log('error while fetching the user :', err)
 })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
  app.listen(3000)
})