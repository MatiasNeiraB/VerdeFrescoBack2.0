const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const {authenticateToken} = require('../middlewares/auth')
const {deleteCart, getCart, getCarts, getOrder} = require('../controllers/cartControllers');


app.route("/cart").get(authenticateToken, getCart);
app.route("/admin/orders").get(authenticateToken, getCarts);
app.route("/admin/orders/:orderId").post(authenticateToken, getOrder);
//app.route("/cart").delete(authenticateToken, deleteCart);

module.exports = app;