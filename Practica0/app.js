
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear servidor Express.js
const app = express();

// Configurar ejs como motor de plantillas
app.set("view engine", "ejs");

// Definir el directorio de plantillas
app.set("views", path.join(__dirname, "public", "views"));

// Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// Crear instancia DAOTask
const daoT = new DAOTasks(pool);

// Getter de la vista tasks.ejs
app.get("/tasks", function(request, response){
    response.status(200);
    daoT.getAllTasks("usuario@ucm.es", function(err, arrayTasks){
        response.render("tasks", arrayTasks); 
    });
})

// Crear middleware static
const static = path.join(__dirname, "public");

// Arrancar middleware static
app.use(express.static(static));

// Arrancar servidor
app.listen(config.port, function(err){
    if(err) console.log("ERROR al iniciar el servidor");

    else console.log(`Servidor arrancado en el puerto ${config.port}`);
});