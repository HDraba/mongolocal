exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1].trim();
  res.render('auth.ejs', {
    path: '/login',
    page: { title: 'Login' },
    isLoggedIn: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'isLoggedIn=true');
  res.redirect('/shop');
};
