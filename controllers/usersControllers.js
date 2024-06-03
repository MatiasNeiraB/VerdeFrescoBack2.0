const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config/db");

const getUser = (request, response) => {
    connection.query("SELECT * FROM users",
        (error, results) => {
            if (error)
                throw error;
            response.status(200).json(results);
        });
};

const login = (req, res) => {
    const { email } = req.body;
    connection.query("SELECT * FROM users WHERE email = ?", [email],
    (error, results) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
        } else {
            if (results.length === 0) {
                res.status(401).json({ mensaje: 'Credenciales no válidas' });
            } else {
                res.status(200).json(results);
            }
        }
    });
}


const postUser = (req, res) => {
    const { id, name, surName, userName, email, password, cases, orders, cart, province, address } = req.body;
    connection.query("INSERT INTO users (id, name, surName, userName, email, password) VALUES (?,?,?,?,?,?);",
        [id, name, surName, userName, email, password, cases, orders, cart, province, address],
        (error, results) => {
            if (error)
                throw error;
            res.status(201).json({ "Usuario añadido correctamente": results.affectedRows });
        });
};


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
    postUser,
    login
};
