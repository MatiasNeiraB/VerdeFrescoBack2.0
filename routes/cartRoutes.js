const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const { deleteCart, getCart, getCarts, getOrder, putCart, addCart,  updateQuantity, deleteProduct } = require('../controllers/cartControllers');
const { authenticateToken, AuthRole } = require('../middlewares/auth')

app.route("/cart").get(authenticateToken, getCart);
app.route("/products").post(authenticateToken, addCart);
app.route("/admin/orders").get(authenticateToken, AuthRole, getCarts);
app.route("/admin/orders/:orderId").post(authenticateToken, AuthRole, getOrder);
app.route("/admin/orders/:id_cart").delete(authenticateToken, AuthRole, deleteCart);
app.route("/admin/orders/:orderId").put(authenticateToken, AuthRole, putCart);
app.route("/cart/:productId").put(authenticateToken, updateQuantity);
app.route("/cart/:productId").delete(authenticateToken, deleteProduct);

module.exports = app;