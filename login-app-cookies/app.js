const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');


const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'i am unknown', resave: false, saveUninitialized: false }))
app.use((req, res, next) => {
  User.findById('670bcc2b3730292380bfcc20')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);




const connectionUri= `mongodb+srv://umasaianvesh:rcYZ1vvfov0EPFeF@cluster0.fiavvsn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`
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
