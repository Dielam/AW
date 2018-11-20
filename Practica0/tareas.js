/*
* Carlos Jiménez Álvarez
* Diego Laguna Martín
*/

module.exports = {

    getToDoTasks: function getToDoTasks(tasks){
        let toDoTasks = tasks.filter(n => n.done == null || n.done == false).map(n => n.text);
        return toDoTasks;
    },

    findByTag: function findByTag(tasks, tag){
        let tasksWithTag = tasks.filter(n => n.tags.includes(tag));
        return tasksWithTag;
    },

    findByTags: function findByTags(tasks, tags){
        let tasksWithTag = tasks.filter(function (n){ 
            return tags.some(m => n.tags.includes(m)); 
            });
        return tasksWithTag;
    },

    countDone: function countDone(tasks){
        let toDoTasks = tasks.filter(n => n.done == true);
        return toDoTasks.length;
    },

    createTask: function createTask(texto){
        let task = {};
        let array = texto.split(" ");
        task.text = array.filter(n => n.indexOf("@") == -1).join(" ");
        task.tags = array.filter(n => n.indexOf("@") >= 0).map(n => n.slice(1));
        task.done = 0;
        return task;
    }
}

