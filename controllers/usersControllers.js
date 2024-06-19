const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const getUser = (request, response) => {
    connection.query("SELECT * FROM users",
        (error, results) => {
            if (error)
                throw error;
            response.status(200).json(results);
        });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const respuesta = await new Promise((resolve, reject) => {
            connection.query("SELECT u.id,  u.name, u.surName , u.email, u.password, r.name_rol AS name_role FROM users u JOIN users_roles ur ON u.id = ur.user_id JOIN roles r ON ur.rol_id = r.id_rol WHERE u.email = ?;", [email], async (error, results) => {
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

                        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        res.status(200).json({ ok: true, token: token, nameUser: user.name, surNameUser: user.surName, rol: user.name_role, });
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
            async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                } else {
                    const userId = results.insertId;
                    connection.query(
                        "SELECT * FROM users WHERE id = ?;",
                        [userId],
                        async (error, results) => {
                            if (error) {
                                console.log(error);
                                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                            } else {
                                const user = results[0];
                                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                                res.status(201).json({ ok: true, mensaje: 'Usuario añadido correctamente', affectedRows: results.affectedRows, token: token, nameUser: user.name, surNameUser: user.surName });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    }
};


const cartDelete = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM cart WHERE id_cart = ?", [id],
        (error, results) => {
            if (error)
                throw error;
            res.status(201).json({ "Carrito eliminado": results.affectedRows });
        });
}



// const alumnoDelete = (req, res) => {
//     const id = req.params.id;
//     connection.query("delete from users where id = ?", [id],
//         (error, results) => {
//             if (error)
//                 throw error;
//             res.status(201).json({ "Alumno eliminado": results.affectedRows });
//         });
// };

// app.put('/alumno/:id', (req, res) => {
//     const id = req.params.id;
//     const { nombre, apellido, direccion, ciudad, tlf } = req.body;
//     const sql = 'update users set nombre = ?, apellido = ?, direccion = ?, ciudad = ?, tlf = ? where id = ?';
//     connection.query(sql, [nombre, apellido, direccion, ciudad, tlf, id], (error, result) => {
//         if (error) {
//             console.error('Error al actualizar el alumno: ' + err.message);
//             res.status(500).send('Error en el servidor');
//         } else {
//             res.status(201).json({ "Item actualizado correctamente": result.affectedRows });
//         }
//     });
// });

module.exports = {
    app,
    getUser,
    register,
    login
};
