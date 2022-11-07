const express = require('express');

const { getShop, getDetailsOfProduct, getCart, postCart, removeItemFromCart, postOrder, getOrders } = require('../controllers/shop');

const router = express.Router();

router.get('/', getShop)

router.get('/products/:productId', getDetailsOfProduct)

router.get('/cart', getCart)
router.post('/cart', postCart)

router.post('/cart-delete-item', removeItemFromCart)

router.post('/create-order', postOrder)
router.get('/orders', getOrders)

module.exports = router