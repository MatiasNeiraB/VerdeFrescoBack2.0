const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const getUsers = (request, response) => {
    connection.query("SELECT u.id,  u.name, u.surName , u.userName, u.email, u.date, u.password, r.name_rol FROM users u JOIN users_roles ur ON u.id = ur.user_id JOIN roles r ON ur.rol_id = r.id_rol;",
        (error, results) => {
            if (error)
                throw error;
            response.status(200).json(results);
        });
};

const getUser = (req, response) => {
    const client_id = req.params.client_id;
    connection.query("SELECT * FROM users WHERE id = ?", [client_id], (error, results) => {
        if (error)
            throw error;
        response.status(200).json(results);
    })
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const respuesta = await new Promise((resolve, reject) => {
            connection.query("SELECT u.id,  u.name, u.surName , u.email, u.password, r.name_rol FROM users u JOIN users_roles ur ON u.id = ur.user_id JOIN roles r ON ur.rol_id = r.id_rol WHERE u.email = ?;", [email], async (error, results) => {
                if (error) {
                    console.log(error);
                } else if (!results) {
                    res.status(401).json({ mensaje: 'Credenciales no válidas1' });
                } else {
                    const user = results[0];
                    const passwordCheck = await bcrypt.compare(password, user.password);
                    if (!passwordCheck) {
                        return res.status(401).json({ mensaje: 'Credenciales no válidas2' });
                    } else {

                        const token = jwt.sign({ id: user.id, rol: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        res.status(200).json({ ok: true, token: token, nameUser: user.name, surNameUser: user.surName, rol: user.name_rol, });
                    }
                }
            });
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    }
}


const register = async (req, res) => {
    try {
        const { name, surName, userName, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        connection.query(
            "INSERT INTO users (name, surName, userName, email, password) VALUES (?,?,?,?,?);",
            [name, surName, userName, email, hashPassword],
            (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                } else {
                    const userId = results.insertId;
                    connection.query(
                        "INSERT INTO users_roles (user_id, rol_id) VALUES (?,2);", [userId], (error, results) => {
                            if (error) {
                                console.log(error);
                                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                            } else {
                                connection.query("SELECT u.id,  u.name, u.surName, r.name_rol FROM users u JOIN users_roles ur ON u.id = ur.user_id JOIN roles r ON ur.rol_id = r.id_rol WHERE u.id = ?;", [userId], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                                    } else {
                                        const user = results[0];
                                        const token = jwt.sign({ id: user.id, rol: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
                                        res.status(201).json({
                                            ok: true, mensaje: 'Usuario añadido correctamente', affectedRows: results.affectedRows, token: token, nameUser: user.name, surNameUser: user.surName
                                        });
                                    }
                                });
                            }
                        }
                    );
                }
            });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    };
};


const putClient = async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const { name, surName, userName, email, rol } = req.body;
        connection.query("UPDATE users SET name = ?, surName = ?, userName = ?, email = ? WHERE id = ?", [name, surName, userName, email, client_id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            } else {
                connection.query("UPDATE users_roles SET rol_id = ? WHERE user_id = ?", [rol, client_id], (error, results) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                    } else {
                        res.status(201).json({ "Cliente actualizado correctamente": results.affectedRows });
                    }
                });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    };
};


module.exports = {
    app,
    getUser,
    getUsers,
    register,
    login,
    putClient,
};
