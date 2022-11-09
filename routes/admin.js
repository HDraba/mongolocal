const express = require('express');

const {
  postAddProducts,
  getAddProduct,
  getEditProduct,
  getShop,
  postEditProduct,
  deleteProduct,
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/shop', isAuth, getShop);

router.get('/add-product', isAuth, getAddProduct);
router.post('/add-product', isAuth, postAddProducts);

// GET => /admin/edit-product/:productId
router.get('/edit-product/:productId', isAuth, getEditProduct);

// POST => /admin/edit-product
router.post('/edit-product', isAuth, postEditProduct);

router.post('/delete-product', isAuth, deleteProduct);

module.exports = router;
