const express = require ('express');
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',      // XAMPP MySQL server is usually localhost
    user: 'root',           // Default XAMPP user is 'root'
    password: '',           // Default XAMPP password is empty
    database: 'gamebox_db'  // Your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to gamebox_db!');
});