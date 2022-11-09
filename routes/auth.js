const express = require('express')
const { postLogin, getLogin, postLogout } = require('../controllers/auth')

const router = express.Router()

router.get('/login', getLogin)
router.post('/login', postLogin)

router.post('/logout', postLogout)

module.exports = router