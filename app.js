// terminal to start the local mongodb server 
  // brew services start mongodb-community@6.0
  // brew services stop mongodb-community@6.0
// new terminal 
  // mongosh 
  // or mongocompass for: localhost:27017

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const mainRoutes = require('./routes/main');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/shop',
  collection: 'sessions'
})

const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection)
app.use(flash())

// re-added old approach due to a lack of model-functions while only fetching data from the db 
app.use((req, res, next) => {
  if (!req.session.user) {
    // returning so nothing after will be executed
    return next()
  }
  // gives a user stored in the session
  User.findById(req.session.user._id)
  .then((user) => {
    req.user = user
    next()
  })
  .catch((err) => {
    console.log(err);
  });
})

app.use((req, res, next) => {
  // locals = sent to every view that's rendered
  res.locals.isLoggedIn = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/main', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);

mongoose
  .connect('mongodb://localhost:27017/shop')
  .then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Hannes',
    //       email: 'test@test.com',
    //       cart: {
    //         item: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
