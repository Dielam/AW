"use strict"; //Se usa para que se tengan que declarar las variables

let listaTareas = [
{ text: "Preparar práctica AW", tags: ["AW", "practica"] },
{ text: "Mirar fechas congreso", done: true, tags: [] },
{ text: "Ir al supermercado", tags: ["personal"] },
{ text: "Mudanza", done: false, tags: ["personal"] },
];

function getToDoTasks(tasks){
    let n;
    let toDoTasks = tasks.filter(n => n.done == null || n.done == false);
    return toDoTasks;
}

function findByTag(tasks, tag){
    let n;
    let tasksWithTag = tasks.filter(n => n.tag.includes(tag));
    return tasksWithTag;
}

function findByTags(tasks, tags){
    let n;
    let tasksWithTag = tasks.filter(n => n.tag.includes(tags));
    return tasksWithTag;
}

function countDone(tasks){
    let n;
    let toDoTasks = tasks.filter(n => n.done == true);
    return toDoTasks.length;
}

function createTask(texto){
	let n;
    let task = {};
    let array = texto.split(" ");
    task.text = array.filter(n => n.indexOf("@") == -1).join(" ");
    task.tags = array.filter(n => n.indexOf("@") >= 0);
    return task;
}