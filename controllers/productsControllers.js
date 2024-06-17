const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config/db");


const getProducts = (request, response) => {
    connection.query("SELECT * FROM products;",
        (error, results) => {
            if (error)
                throw error;
            response.status(200).json(results);
        });
};

const addCart = async (req, res) => {
    try {
        const clientId = req.user;
        const id_cliente = clientId.id;
        const { product_id, quantity } = req.body;
        connection.query("SELECT * FROM cart WHERE user_id = ?", [id_cliente], async (error, results) => {
            if (error) {
                console.log(error);
            } else if (results.length === 0) {
                connection.query("INSERT INTO cart (user_id, status_cart) VALUES (?, 'Creado');",
                    [id_cliente], async (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ mensaje: 'Error al crear el carrito', error: error.message });
                        } else {
                            res.status(201).json({ mensaje: 'Carrito creado correctamente' });
                            const cartId = results.insertId;
                            connection.query("INSERT INTO product_cart (cart_id, product_id, quantity) VALUES (?,?,?);",
                                [cartId, product_id, quantity], async (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                                    } else {
                                        res.status(201).json({ mensaje: 'Producto añadido correctamente', affectedRows: results.affectedRows });
                                    }
                                });
                        }
                    });
            } else {
                console.log("Carrito existente");
                const cart_id = results[0].id_cart;
                connection.query("INSERT INTO product_cart (cart_id, product_id, quantity) VALUES (?,?,?);",
                    [cart_id, product_id, quantity], async (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
                        } else {
                            res.status(201).json({ mensaje: 'Producto añadido correctamente', affectedRows: results.affectedRows });
                        }
                    });
            }
        });
    } catch (error) {
        console.error('Error al agregar producto al carrito', error);
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    }
};

module.exports = {
    app,
    getProducts,
    addCart
};


