const repository = require("../dbRepo/repository")
const logger = require("../../utilities/logger")
const httpStatus = require("http-status-codes")
var http = require("http")

const authenticator = require("../middleware/webTokenAuthentication")

exports.insertProductsToCart = async (req, res) => {
    try {
        var cartDetails = req.body
        try {
            const authHeader = req.headers["authorization"]
            tokenDetails = authenticator.getUserDetailsFromToken(authHeader)
            console.log("Token ID",tokenDetails._id)
        }catch(err) {
            logger.info(`Error in Token authentication and Error is: ${err}`); 
            return res.status(403).json({code: 403, type: httpStatus.getStatusText(403), 
                message:"Invalid token"}) 
        }
        try {
            let productDetails = await getProductDetails(req.body.productID)
            let price = productDetails.price
           // price = 480.00 
        }catch(err) {
            logger.info(`Error in getting price and Error is: ${err}`); 
            return res.status(500).json({code: 500, type: httpStatus.getStatusText(500), 
                message:"Internal Server Error, please try again after sometime"})   
        }
        cartDetails.subTotal = price * cartDetails.quantity
        cartDetails.productName = productDetails.productName
        var flag = await repository.insertProduct(cartDetails, tokenDetails._id);
        if (flag == true) {
            return res.send({ "code": "200", "type":httpStatus.getStatusText(200), 
            "message":"Successfull Operation"});
        } else {
            throw "Product already exists"
        }
    }catch (err) {
        logger.info(`Error in inserting products to cart and Error is: ${err}`); 
        return res.status(409).json({code: 409, type: httpStatus.getStatusText(409), 
            message:"Product already exist in cart"})
    }
}

async function getProductDetails(productID) {
    var price
    await new Promise((resolve, reject) => {
        http.get('http://localhost:1236/catalog/' + productID, (resp) => {
            resp.on('data', (data) => {
                try{
                    productDetails = JSON.parse(data.toString('utf8'))
                    // price = productDetails.price
                    resolve(productDetails)
                }catch(err) {
                    reject(err)
                }
            }, error => {
                reject(error)
            });
        })
    });
    console.log(price)
    return price
}

exports.pingHandler = async (req, res) => {
    res.send({ "Status": "200 OK" })
}

exports.getHandler = async (req, res) => {
    try {
        try {
            const authHeader = req.headers["authorization"]
            tokenDetails = authenticator.getUserDetailsFromToken(authHeader)
            console.log("Token ID",tokenDetails._id)
        }catch(err) {
            logger.info(`Error in Token authentication and Error is: ${err}`); 
            return res.status(403).json({code: 403, type: httpStatus.getStatusText(403), 
                message:"Invalid token"}) 
        }

        const cartItems = await repository.getItems(tokenDetails._id)
        if (cartItems.length == 0) {
            throw "No Data"
        }
        res.set({
            'Content-Type': 'application/json',
            'Status' : 200}) 
        res.send(cartItems)
    } catch (err) {
        logger.info(`Error in getting cart details and Error is: ${err}`);
        res.status(404).json({code: 404, type: httpStatus.getStatusText(404), message: "No Items in the cart"}) 
    }
}