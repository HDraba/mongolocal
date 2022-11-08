const express = require('express')
const { postLogin, getLogin } = require('../controllers/auth')

const router = express.Router()

router.get('/login', getLogin)
router.post('/login', postLogin)

module.exports = router