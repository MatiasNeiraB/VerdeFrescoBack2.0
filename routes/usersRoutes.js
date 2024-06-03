const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getUser, postUser, login } = require('../controllers/usersControllers');


app.route("/users").get(getUser);
app.route("/user").post(postUser);
app.route("/login").post(login);


module.exports = app;