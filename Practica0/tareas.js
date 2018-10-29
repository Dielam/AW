/*
* Carlos Jiménez Álvarez
* Diego Laguna Martín
*/

"use strict"; //Se usa para que se tengan que declarar las variables

let listaTareas = [
{ text: "Preparar práctica AW", tags: ["AW", "practica"] },
{ text: "Mirar fechas congreso", done: true, tags: [] },
{ text: "Ir al supermercado", tags: ["personal"] },
{ text: "Mudanza", done: false, tags: ["personal"] },
];

function getToDoTasks(tasks){
    let toDoTasks = tasks.filter(n => n.done == null || n.done == false).map(n => n.text);
    return toDoTasks;
}

function findByTag(tasks, tag){
    let tasksWithTag = tasks.filter(n => n.tags.includes(tag));
    return tasksWithTag;
}

function findByTags(tasks, tags){
    let tasksWithTag = tasks.filter(function (n){ 
        return tags.some(m => n.tags.includes(m)); 
    	});
    return tasksWithTag;
}

function countDone(tasks){
    let toDoTasks = tasks.filter(n => n.done == true);
    return toDoTasks.length;
}

function createTask(texto){
    let task = {};
    let array = texto.split(" ");
    task.text = array.filter(n => n.indexOf("@") == -1).join(" ");
    task.tags = array.filter(n => n.indexOf("@") >= 0).map(n => n.slice(1));
    return task;
}