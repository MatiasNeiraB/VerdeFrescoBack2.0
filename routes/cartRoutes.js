const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const {authenticateToken} = require('../middlewares/auth')
const {deleteCart, getCart} = require('../controllers/cartControllers');


app.route("/cart").get(authenticateToken, getCart);
//app.route("/cart").delete(authenticateToken, deleteCart);

module.exports = app;