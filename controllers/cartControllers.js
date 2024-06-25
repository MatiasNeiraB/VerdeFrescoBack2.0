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
    connection.query("SELECT u.name, u.surName, c.id_cart, c.date, c.status_cart, SUM(p.price * pc.quantity) AS totalOrder FROM users u JOIN cart c ON u.id = c.user_id JOIN product_cart pc ON c.id_cart = pc.cart_id JOIN products p ON pc.product_id = p.id GROUP BY u.name, u.surName, c.id_cart, c.date, c.status_cart;", async (error, results) => {
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


const deleteCart = (req, res) => {
    const id_cart = req.params.id_cart;
    connection.query("DELETE FROM cart WHERE id_cart = ?", [id_cart],
        (error, results) => {
            if (error)
                throw error;
            res.status(201).json({ "Carrito eliminado con éxito": results.affectedRows });
        });
}

const putCart = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const {status_cart } = req.body;
        connection.query("UPDATE cart SET status_cart = ? WHERE id_cart = ?;", [ status_cart, orderId ], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            } else {
                res.status(201).json({ "Orden actualizado correctamente": results.affectedRows });
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
    getCart,
    deleteCart,
    getCarts,
    getOrder,
    putCart,
};