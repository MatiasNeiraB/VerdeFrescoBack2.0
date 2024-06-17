const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config/db");


const getCart = (req, res) => {
    const clientId = req.user;
    const id_cliente = clientId.id;
        connection.query("SELECT * FROM cart WHERE user_id = ? and status_cart = 'Creado'", [id_cliente], async (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results);
        });
};



// const deleteCart = (req, res) => {
//     const id = req.params.id;
//     connection.query("SELECT * FROM cart WHERE id_cart = ?", [id],
//         (error, results) => {
//             if (error)
//                 throw error;
//             res.status(201).json({ "Cart eliminado": results.affectedRows });
//         });
// };





module.exports = {
    app,
    getCart,
    //deleteCart,
};