const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// const transporter = nodemailer.createTransport(sendgridTransport({
// auth: {
//  // api_user:
// api_key:
// }
// }))

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth.ejs', {
    path: '/login',
    page: { title: 'Login' },
    // isLoggedIn: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'invalid email or password');
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
        req.flash('error', 'invalid email or password');
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
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('signup.ejs', {
    path: '/signup',
    page: { title: 'Signup' },
    isLoggedIn: false,
    errorMessage: message,
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
        req.flash('error', 'Email exists already');
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
          //   return transporter.sendMail({
          // to: email,
          // from: 'shop@node-complete.com',
          // subject: 'Signup succeeded',
          // html: '<h1>You successfully signed up!</h1>'
        })
        .catch((err) => console.log(err));
      // });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('reset.ejs', {
    path: '/reset',
    page: { title: 'Reset Password' },
    errorMessage: message,
  });
};
