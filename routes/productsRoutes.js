const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getProducts, addCart, getProductsAdmin, getProductAdmin} = require('../controllers/productsControllers');
const {authenticateToken} = require('../middlewares/auth')


app.route("/products").get(authenticateToken, getProducts);
app.route("/products").post(authenticateToken, addCart);
app.route("/admin/products").get(authenticateToken, getProductsAdmin);
app.route("/admin/products/:product_id").post(authenticateToken,  getProductAdmin);

module.exports = app;