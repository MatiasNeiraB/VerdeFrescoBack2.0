const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getUser, postUser, login, Register } = require('../controllers/usersControllers');
const {auth} = require('../middlewares/auth')


app.route("/users").get(getUser);
app.route("/register").post(Register);
app.route("/login").post(login);


module.exports = app;