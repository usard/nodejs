const path = require('path');
const User = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const {mongoConnect } = require('./util/database');

// const errorController = require('./controllers/error');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
 User.findById(`670bcc2b3730292380bfcc20`).then((user)=> {
  req.user = user
  next()
 }).catch(err=> {
    console.log('error while fetching the user :', err)
 })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);
const connectionUri= `mongodb+srv://umasaianvesh:rcYZ1vvfov0EPFeF@cluster0.fiavvsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(connectionUri)
.then(res=> {
  const user = new User({username: 'anvesh', email: 'umasai.anvesh@gmail.com',cart:{items:[]}})
  if (!user._id) {
    user.save()
    .then(
      result => console.log('user created')
    )
    .catch(err=> console.log(err))
  }  
  console.log('succesfully connected to database');
  app.listen(3000)
})
.catch(err=> console.log('error while connecting to mongodb'))
