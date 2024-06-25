const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getProducts, addCart, getProductsAdmin, getProductAdmin, putProduct, deleteProduct, addProductAdmin} = require('../controllers/productsControllers');
const {authenticateToken, AuthRole} = require('../middlewares/auth')


app.route("/products").get(getProducts);
app.route("/products").post(addCart);
app.route("/admin/products").get(authenticateToken, getProductsAdmin);
app.route("/admin/products").post(authenticateToken, addProductAdmin);
app.route("/admin/products/:product_id").post(authenticateToken, getProductAdmin);
app.route("/admin/products/:product_id").put(authenticateToken, putProduct);
app.route("/admin/products/:product_id").delete(authenticateToken, deleteProduct);

module.exports = app;