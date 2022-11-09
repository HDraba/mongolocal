const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getShop = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop.ejs', {
      isAdmin: true,
      page: { title: 'Shop' },
      path: '/admin-shop',
      products: products,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  console.log('getaddprod');
  res.render('add-product', {
    page: { title: 'Add Product' },
    path: '/add-product',
    isLoggedIn: req.isLoggedIn,
  });
};

exports.postAddProducts = (req, res, next) => {
  console.log('postproduct');
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  });
  product
    .save()
    .then((data) => {
      //   console.log('Stuff ', data);
      res.redirect('/shop');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render('edit-product', {
        product: product,
        page: { title: 'Edit Product' },
        path: '/admin-shop',
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findById(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.save();
    })
    .then(() => {
      res.redirect('/admin/shop');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/shop');
    })
    .catch((err) => {
      console.log(err);
    });
};
