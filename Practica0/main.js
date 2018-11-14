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

// Definición de las funciones callback
let allTasks = function(error, arrayTasks){
    console.log("getAllTasks: error", error, "arrayTasks", arrayTasks);
};
let newTasks = function(error){
    console.log("insertTask: error", error);
};
let markTaskDone = function(error){
    console.log("markTaskDone: error", error)
};
let deleteCompleted = function(error){
    console.log("deleteCompleted: error", error);
};
let userCorrect = function(error, correct){
    console.log("userCorrect: error", error, "correct", correct);
};
let imageName = function(error, name){
    console.log("getUserImageName: error", error, "User image name: ", name);
};

// Uso de los métodos de las clases DAOUsers y DAOTasks
let daoTasks = new DAOTasks(pool);
let daoUsers = new DAOUsers(pool);
let newTask = {
    text: "comprar",
    tags: ["personal", "super"],
    done: 0
}

//Test DAOTasks
daoTasks.getAllTasks("test@mail.com", allTasks);
daoTasks.insertTask("test@mail.com", newTask, newTasks);
daoTasks.markTaskDone(1, markTaskDone);
daoTasks.deleteCompleted("test@mail.com", deleteCompleted);
//Test DAOUsers
daoUsers.isUserCorrect("test@mail.com", "123456", userCorrect);
daoUsers.getUserImageName("test@mail.com", imageName);