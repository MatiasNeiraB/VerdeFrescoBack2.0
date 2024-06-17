const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getProducts, addCart} = require('../controllers/productsControllers');
const {authenticateToken} = require('../middlewares/auth')


app.route("/products").get(authenticateToken, getProducts);
app.route("/products").post(authenticateToken, addCart);


module.exports = app;