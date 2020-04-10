const mongoose = require('mongoose')
mongoose.set('debug', true)
const Cart = mongoose.model("Cart")

const insertProduct = async (data, userID) => {

    const id = userID //mongoose.Types.ObjectId(userID)
    console.log("userId is ", id)
    var exists = await getProduct(id, data.productID)
    if (exists == true) {

        return false
    }
    const dat = await Cart.updateOne({ "userID": id }, { "$push": { "products": data } });
    console.log("Data ", dat)
    await updateGrandTotal(id)
    return true
}

const deleteItems = async (productID, userID) => {
    if (await getProduct(userID, productID)) {
        await Cart.updateOne({ "userID": userID }, { "$pull": { products: { "productID": productID } } })
        updateGrandTotal(userID)
        return true
    }
    return false
}

const updateQuantity = async (userID, data) => {
    console.log(data.price)
    await Cart.updateOne({ "userID": userID, "products.productID": data.productID }, { $set: { "products.$.quantity": data.quantity, "products.$.subTotal": data.quantity * data.price } })
    await updateGrandTotal(userID)
}

async function getProduct(userID, productID) {
    var existFlag = false
    var product = await Cart.find({ 'userID': userID, 'products.productID': productID }, { 'products': 0 })
    console.log("get product", product)
    if (product.length > 0) {
        existFlag = true
    }
    return existFlag
}

const getItems = (userID) => {
    var items = Cart.find({ "userID": userID })
    return items
}

const updateGrandTotal = async (id) => {
    var total = await Cart.aggregate([
        { $match: { userID: id } }, 
        { $project: { "grandTotal": { "$sum": "$products.subTotal" } } }]).exec();
    //Todo: check what is the value & type of total
    const gt = total[0].grandTotal
    if ((total.length) > 0) {
        const updat = await Cart.updateOne({ userID: id }, { $set: { "grandTotal": gt } });
        return total[0].grandTotal
    } else {
        return 0
    }
}

module.exports = {insertProduct, updateGrandTotal, getItems, deleteItems, updateQuantity}