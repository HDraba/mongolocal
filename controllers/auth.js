const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  console.log(req.session.isLoggedIn);
  res.render('auth.ejs', {
    path: '/login',
    page: { title: 'Login' },
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('6368d4a004c9b3df27129022')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/shop');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/shop');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('signup.ejs', {
    path: '/signup',
    page: { title: 'Signup' },
    isLoggedIn: false,
  });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({
    email: email,
  })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      const user = new User({
        username: username,
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};
