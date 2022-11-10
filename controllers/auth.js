const bcrypt = require('bcryptjs');
const { rawListeners } = require('../models/user');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  console.log(req.session.isLoggedIn);
  res.render('auth.ejs', {
    path: '/login',
    page: { title: 'Login' },
    isLoggedIn: false,
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            req.flash('error', 'invalid email or password')
            return res.redirect('/login');
        }
        bcrypt
        .compare(password, user.password)
      .then((areMatching) => {
        if (areMatching) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect('/shop');
          });
        }
        res.redirect('/login');
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/login');
      });
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
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })

    .catch((err) => {
      console.log(err);
    });
};
