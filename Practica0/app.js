
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const tareas = require("./tareas.js");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mySqlSession = require("express-mysql-session");
const fs = require("fs");

// Crear servidor Express.js
const app = express();

// Configurar ejs como motor de plantillas
app.set("view engine", "ejs");

// Definir el directorio de plantillas
app.set("views", path.join(__dirname, "public", "views"));

// Crear la sesion
const mySqlStore = mySqlSession(session);

// Crear el almacen de la sesion
const sessionStore = new mySqlStore(config.mysqlConfig);

//Crear middleware middlewareSession
const middlewareSession = session({
    saveUninitialized: false,
    secret: "Pr05Y54DM1N",
    resave: false,
    store: sessionStore
});

// Arrancar middleware middlewareSession
app.use(middlewareSession);

// Crear middleware static
const staticFiles = path.join(__dirname, "public");

// Arrancar middleware static
app.use(express.static(staticFiles));

// Arrancar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// Crear instancia DAOTasks
const daoT = new DAOTasks(pool);

// Crear instancia DAOUsers
const daoU = new DAOUsers(pool);

// GET de login
app.get("/login", function(request, response){
    response.status(200);
    if(request.session.currentUser != null){
        response.redirect("/tasks");
    } 
    else{
        response.render("login", {"errorMsg": true});
    }
});

// POST de login
app.post("/login", function(request, response){
    response.status(200);
    daoU.isUserCorrect(request.body.email, request.body.password, function(err, ok){
        if(err) next(new Error(err));
        if(ok){
            request.session.currentUser = request.body.email;
            response.redirect("/tasks");
        }  
        else{
            response.render("login", {"errorMsg": null});
        }
    });
});

// GET de logout
app.get("/logout", function(request, response){
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

// GET de la vista tasks.ejs
app.get("/tasks", function(request, response){
    response.status(200);
    daoT.getAllTasks(request.session.currentUser, function(err, tasksList){
        if(err) next(new Error(err));
        response.render("tasks", {"tasksList": tasksList}); 
    });
});

// POST del formulario de añadir tareas de la vista tasks.ejs
app.post("/addTask", function(request, response){
    response.status(200); 
    daoT.insertTask(request.session.currentUser, tareas.createTask(request.body.new_task), function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
    });
});

// GET de marcar las tareas como finalizadas
app.get("/finish/:taskId", function(request, response){
    response.status(200);
    daoT.markTaskDone(request.params.taskId, function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
    });
});

// GET de borrar todas las tareas completadas
app.get("/deleteCompleted", function(request, response){
    response.status(200); 
    daoT.deleteCompleted(request.session.currentUser, function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
    });
});

// Manejador del error
app.use(function(error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error", {
        mensaje: error.message,
        pila: error.stack
    });
});


// Gestión de error 404
app.use(function(request, response, next) {
    response.status(404);
    response.render("not_found", { url: request.url });
});

// Arrancar servidor
app.listen(config.port, function(err){
    if(err) console.log("ERROR al iniciar el servidor");

    else console.log(`Servidor arrancado en el puerto ${config.port}`);
});