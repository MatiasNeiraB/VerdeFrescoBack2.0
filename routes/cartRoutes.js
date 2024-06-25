const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const {deleteCart, getCart, getCarts, getOrder, putCart} = require('../controllers/cartControllers');
const {authenticateToken, AuthRole} = require('../middlewares/auth')


app.route("/cart").get(getCart);
app.route("/admin/orders").get(getCarts);
app.route("/admin/orders/:orderId").post(authenticateToken, getOrder);
app.route("/admin/orders/:id_cart").delete(authenticateToken, deleteCart);
app.route("/admin/orders/:orderId").put(authenticateToken, putCart);

module.exports = app;