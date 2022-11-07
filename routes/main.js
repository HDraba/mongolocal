const express = require('express')

const { getMain } = require("../controllers/main");

const router = express.Router();

router.get('/', getMain)

module.exports = router