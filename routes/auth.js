const express = require('express')
const { postLogin, getLogin, postLogout, getSignup, postSignup, getReset } = require('../controllers/auth')

const router = express.Router()

router.get('/login', getLogin)
router.post('/login', postLogin)

router.post('/logout', postLogout)

router.get('/signup', getSignup)
router.post('/signup', postSignup)

router.get('/reset', getReset)

module.exports = router