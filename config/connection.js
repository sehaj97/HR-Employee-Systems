const mysql = require('mysql2');
const dotenv = require('dotenv')
dotenv.config()

const connectionProperties = {
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const connection = mysql.createConnection(connectionProperties);

module.exports = {
    connectionProperties,
    connection
};