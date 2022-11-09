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
