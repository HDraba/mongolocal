const express = require('express')
const { postLogin, getLogin, postLogout, getSignup, postSignup, getReset, postReset, getNewPassword, postNewPassword } = require('../controllers/auth')

const router = express.Router()

router.get('/login', getLogin)
router.post('/login', postLogin)

router.post('/logout', postLogout)

router.get('/signup', getSignup)
router.post('/signup', postSignup)

router.get('/reset', getReset)
router.post('/reset', postReset)

router.get('/reset/:token', getNewPassword)
router.post('/new-password', postNewPassword)

module.exports = router