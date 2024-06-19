const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getUser, login, register } = require('../controllers/usersControllers');


app.route("/users").get(getUser);
app.route("/register").post(register);
app.route("/login").post(login);




module.exports = app;