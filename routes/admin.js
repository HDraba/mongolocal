const express = require('express')

const { postAddProducts, getAddProduct, getEditProduct, getShop, postEditProduct, deleteProduct } = require('../controllers/admin')

const router = express.Router()

router.get('/shop', getShop)

router.get('/add-product', getAddProduct)
router.post('/add-product', postAddProducts)

// GET => /admin/edit-product/:productId
router.get('/edit-product/:productId', getEditProduct)

// POST => /admin/edit-product
router.post('/edit-product', postEditProduct)

router.post('/delete-product', deleteProduct)

module.exports = router