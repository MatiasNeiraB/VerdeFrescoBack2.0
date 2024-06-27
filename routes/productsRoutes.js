const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getProducts, getProductsAdmin, getProductAdmin, putProduct, deleteProduct, addProductAdmin } = require('../controllers/productsControllers');
const { authenticateToken, AuthRole } = require('../middlewares/auth')


app.route("/products").get(getProducts);
app.route("/admin/products").get(authenticateToken, AuthRole, getProductsAdmin);
app.route("/admin/products").post(authenticateToken, AuthRole, addProductAdmin);
app.route("/admin/products/:product_id").post(authenticateToken, AuthRole, getProductAdmin);
app.route("/admin/products/:product_id").put(authenticateToken, AuthRole, putProduct);
app.route("/admin/products/:product_id").delete(authenticateToken, AuthRole, deleteProduct);

module.exports = app;