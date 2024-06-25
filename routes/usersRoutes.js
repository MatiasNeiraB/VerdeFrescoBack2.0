const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { getUsers, getUser, login, register, putClient } = require('../controllers/usersControllers');
const {authenticateToken, AuthRole} = require('../middlewares/auth');

app.route("/register").post(register);
app.route("/login").post(login);
app.route("/admin/clients").get(authenticateToken, getUsers);
app.route("/admin/clients/:client_id").post(authenticateToken, getUser);
app.route("/admin/clients/:client_id").put(authenticateToken, putClient);




module.exports = app;