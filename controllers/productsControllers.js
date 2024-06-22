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

const getProductsAdmin = (request, response) => {
    connection.query("SELECT * FROM products;",
        (error, results) => {
            if (error)
                throw error;
            response.status(200).json(results);
        });
};

const getProductAdmin = (req, response) => {
    const product_id = req.params.product_id;
    connection.query("SELECT * FROM products WHERE id = ?", [product_id], async (error, results) => {
        if (error)
            throw error;
        response.status(200).json(results);
    })
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
                        } const productDinamico = document.getElementById('name_product');
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <div>
                                <label for="recipient-name"  class="col-form-label">Nombre:</label>
                                <input type="text" class="form-control" value="${product.name}" id="recipient-name">
                            </div>
                        `;
                        productDinamico.appendChild(div);
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

const putProduct = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const {name, descriptions, price, img} = req.body;
        connection.query("UPDATE products SET name = ?, descriptions = ?, price = ?, img = ? WHERE id = ?", [name, descriptions, price, img, product_id], async (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            }else{
                res.status(201).json({ "Producto actualizado correctamente": result.affectedRows });
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
    getProducts,
    addCart,
    getProductsAdmin,
    getProductAdmin,
    putProduct,
};

