"use strict";

const mysql = require("C:\\Program Files\\nodejs\\node_modules\\mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
   host: config.host,
   user: config.user,
   password: config.password,
   database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

// Definición de las funciones callback
let allTasks = function(error, arrayTasks){
    console.log("error", error, "arrayTasks", arrayTasks);
};

// Uso de los métodos de las clases DAOUsers y DAOTasks
let daoTasks = new DAOTasks(pool);
daoTasks.getAllTasks("test@mail.com", allTasks);