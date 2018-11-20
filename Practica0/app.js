
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const tareas = require("./tareas.js");
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

// Crear middleware static
const staticFiles = path.join(__dirname, "public");

// Arrancar middleware static
app.use(express.static(staticFiles));

// Arrancar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// Crear instancia DAOTask
const daoT = new DAOTasks(pool);

// GET de la vista tasks.ejs
app.get("/tasks", function(request, response){
    response.status(200);
    daoT.getAllTasks("usuario@ucm.es", function(err, tasksList){
        //if(err)
        response.render("tasks", {"tasksList": tasksList}); 
    });
});

// POST del formulario de añadir tareas de la vista tasks.ejs
app.post("/addTask", function(request, response){
    response.status(200); 
    daoT.insertTask("usuario@ucm.es", tareas.createTask(request.body.new_task), function(err){
        console.log(err);
        //if(err)
        response.redirect("/tasks");
    });
});

// Arrancar servidor
app.listen(config.port, function(err){
    if(err) console.log("ERROR al iniciar el servidor");

    else console.log(`Servidor arrancado en el puerto ${config.port}`);
});