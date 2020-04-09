const jwt = require('jsonwebtoken')
const httpStatus = require("http-status-codes")

require('dotenv').config()

//getUserDetails
exports.getUserDetailsFromToken = (authHeader) => {
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) throw "No token present"
   
       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
           if (err) {
                logger.info(`Error in verifying token and Error is: ${err}`);
                throw err
            }
           tokenDetails = user
           console.log(tokenDetails)
       })
return tokenDetails
}