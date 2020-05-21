require('../model/model');
const controller = require('../controller/controller');

const express = require('express')
const router = express.Router();

router.put("/", controller.insertProductsToCart)

router.put("/quantity", controller.updateQuantityHandler)

router.get("/", controller.getHandler)

router.delete("/:productID", controller.deleteHandler)

router.get("/ping", controller.pingHandler)

router.post("/", controller.createCart)

router.put("/del", controller.removeAllProducts)

module.exports = router