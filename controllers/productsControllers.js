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
    connection.query("SELECT * FROM products WHERE id = ?", [product_id], (error, results) => {
        if (error)
            throw error;
        response.status(200).json(results);
    })
};


const putProduct = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const { name, descriptions, price, img } = req.body;
        connection.query("UPDATE products SET name = ?, descriptions = ?, price = ?, img = ? WHERE id = ?", [name, descriptions, price, img, product_id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            } else {
                res.status(201).json({ "Producto actualizado correctamente": results.affectedRows });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
    };
};

const deleteProduct = (req, res) => {
    const product_id = req.params.product_id;
    connection.query("DELETE FROM products WHERE id = ?", [product_id],
        (error, results) => {
            if (error) {
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            }
            res.status(201).json({ "Producto eliminado con éxito": results.affectedRows });
        });
};


const addProductAdmin = (req, res) => {
    const { name, descriptions, price, img } = req.body;
    connection.query("INSERT INTO products (name, descriptions, price, img) VALUES (?,?,?,?);", [name, descriptions, price, img],
        (error, results) => {
            if (error) {
                res.status(500).json({ mensaje: 'Error en la base de datos', error: error.message });
            }
            res.status(201).json({ "Producto añadido correctamente": results.affectedRows });
        });
};



module.exports = {
    app,
    getProducts,
    getProductsAdmin,
    getProductAdmin,
    putProduct,
    deleteProduct,
    addProductAdmin,
};

