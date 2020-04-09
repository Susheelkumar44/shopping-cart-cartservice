require('../model/model');
const controller = require('../controller/controller');

const express = require('express')
const router = express.Router();

router.put("/", controller.insertProductsToCart)

router.get("/", controller.getHandler)

module.exports = router