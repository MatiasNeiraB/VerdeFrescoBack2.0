const dotenv = require("dotenv");
const mysql = require('mysql');

dotenv.config();
let connection;


    connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE
    });

module.exports = {connection};
