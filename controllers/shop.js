const mongoose = require('mongoose');

const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getShop = (req, res, next) => {
  Product.find().then((products) => {
    // console.log(products);
    res.render('shop.ejs', {
      isAdmin: false,
      page: { title: 'Shop' },
      path: '/shop',
      products: products,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
  //   console.log('Hello Shop');
};

exports.getDetailsOfProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    res.render('product-detail', {
      product: product,
      page: { title: 'Product-Details' },
      path: '/shop',
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getCart = async (req, res, next) => {
  // more like fetching the products of the cart
  const populateCart = async () => {
    return await req.session.user.populate('cart.items.productId');
  };
  await populateCart()
    .then((user) => {
      const products = user.cart.items;
      //   console.log(products);
      res.render('cart.ejs', {
        page: { title: 'Cart' },
        path: '/cart',
        products: products,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId).then((product) => {
    // console.log(product)
    return req.session.user
      .addToCart(product)
      .then(() => {
        res.redirect('/shop/cart');
      })
      .catch((err) => console.log(err));
  });
};

exports.removeItemFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.session.user
    .removeFromCartById(productId)
    .then(res.redirect('/shop/cart'))
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = async (req, res, next) => {
  const populateCart = async () => {
    return await req.session.user.populate('cart.items.productId');
  };
  await populateCart()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user,
        },
        products: products,
      });
      order.save();
      req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/shop/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.uaerId': req.session.user._id }).then((orders) => {
    res.render('orders.ejs', {
      path: '/orders',
      page: { title: 'Your Orders' },
      orders: orders,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};
