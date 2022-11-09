const express = require('express');

const {
  getShop,
  getDetailsOfProduct,
  getCart,
  postCart,
  removeItemFromCart,
  postOrder,
  getOrders,
} = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', getShop);

router.get('/products/:productId', getDetailsOfProduct);

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, removeItemFromCart);

router.post('/create-order', isAuth, postOrder);
router.get('/orders', isAuth, getOrders);

module.exports = router;
