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


const getCarts = (req, res) => {
    connection.query("SELECT u.name, u.surName, c.id_cart, c.date, c.status_cart, SUM(p.price * pc.quantity) AS totalOrder FROM users u JOIN cart c ON u.id = c.user_id JOIN product_cart pc ON c.id_cart = pc.cart_id JOIN products p ON pc.product_id = p.id;", async (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results);
    });
};



const getOrder = (req, res) => {
    const orderId = req.params.orderId;
    connection.query("SELECT u.name, u.surName, c.id_cart, c.date, c.status_cart, pc.product_id, pc.quantity, p.name AS product_name, p.price, p.price * pc.quantity AS subtotal FROM users u JOIN cart c ON u.id = c.user_id JOIN product_cart pc ON c.id_cart = pc.cart_id JOIN products p ON pc.product_id = p.id WHERE pc.cart_id = ?;", [orderId], async (error, results) => {
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
    getCarts,
    getOrder,
};