const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { addUsers, getUsers, getUser, login, register, putClient, deleteClient } = require('../controllers/usersControllers');
const {authenticateToken, AuthRole} = require('../middlewares/auth');

app.route("/register").post(register);
app.route("/login").post(login);
app.route("/admin/clients").get(authenticateToken, AuthRole, getUsers);
app.route("/admin/clients").post(authenticateToken, AuthRole, addUsers);
app.route("/admin/clients/:client_id").post(authenticateToken, AuthRole, getUser);
app.route("/admin/clients/:client_id").put(authenticateToken, AuthRole, putClient);
app.route("/admin/clients/:client_id").delete(authenticateToken, AuthRole, deleteClient);



module.exports = app;