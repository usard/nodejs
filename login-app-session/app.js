const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session)

const connectionUri= `mongodb+srv://umasaianvesh:rcYZ1vvfov0EPFeF@cluster0.fiavvsn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`

const store = new MongoDbStore({
  uri: connectionUri,
  collections: 'sessions'
});


const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
        session(
                {
                  secret:'my secret', 
                  resave: false, 
                  saveUninitialized: false ,
                  store: store
                }
              )
      )

app.use((req,res,next)=>{
  if(!req.session.user){
     next()
     return
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next()
  })
  .catch(err=> console.log(err))
  // req.session.isLoggedIn = true
  // req.session.user = user
  // res.redirect('/');
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect(connectionUri)
.then(res=> {
  const user = new User({name: 'anvesh', email: 'umasai.anvesh@gmail.com',cart:{items:[]}})
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