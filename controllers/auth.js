//nodejs built-in
const crypto = require('crypto');

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

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiraton = Date.now() + 3600000; // 1h in ms
        return user.save(); // updating user in database
      })
      .then((result) => {
        res.redirect('/shop');
        // transporter.sendMail({
        // to: req.body.email,
        // from: 'shop@node-complete.com',
        // subject: 'Password reset',
        // html: `
        // <p>You requested a password reset</p>
        // <p>Click <a href="http://localhost:3000/reset/${token}">Here</a> to set a new password</p>
        // `
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiraton: { $gt: Date.now() } }) // special Operator: gt = greater than
    .then((user) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('new-password.ejs', {
        path: '/new-password',
        page: { title: 'new Password' },
        errorMessage: message,
        userId: user_id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiraton: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiraton = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
