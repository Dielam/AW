"use strict";

let pool;

class DAOTasks {
    constructor(pool){ 
        this.pool = pool;
    }
    
    getAllTasks(email, callback){
        var arrayTasks = [];
        this.pool.getConnection(function(err, connection){
            if (err) {
                return callback("Error de conexión a la base de datos", arrayTasks);
            } else {
                connection.query(
                    "SELECT id, text, tag, done FROM task LEFT JOIN tag ON task.id = tag.taskId WHERE user = ?",
                    [email],
                    function(error, filas) {
                        connection.release();

                        if (error) {
                                return callback("Error de acceso a la base de datos");
                        }
                        else {

                            filas.forEach(element => {
                                let pos = arrayTasks.findIndex(object =>{
                                    return element.id == object.id;
                                });
                                if(pos == -1){

                                    arrayTasks.push({
                                            "id"	: element.id,
                                            "text"	: element.text,
                                            "done"	: element.done,
                                            "tags"  : element.tag == null ? null : [element.tag]
                                    });
                                }
                                else{
                                    element.tag == null ? null : arrayTasks[pos].tags.push(element.tag);
                                }

                            });
                        }
                        callback(error, arrayTasks);
                    }
                );

            }	
        });

    }
    
    insertTask(email, task, callback){
        this.pool.getConnection(function(err, connection){
            if (err) {
                return callback("Error de conexión a la base de datos");
            } else {
                connection.query(
                    "INSERT INTO task(user, text, done) VALUES (?, ?, ?)",
                    [email, task.text, task.done],
                function(error, result) {

                    if (error) {
                        return callback("Error de acceso a la base de datos");
                    }
                    else {
                        if(task.tags != null && task.tags.length > 0){
                            let parameters = "";
                            let values = [];
                            task.tags.forEach((element, index) => {
                                parameters += "(?,?)";
                                values.push(result.insertId);
                                values.push(element);
                                if(index !== task.tags.length - 1) parameters += ",";
                            });
                            connection.query(
                                "INSERT INTO tag(taskId,tag) VALUES " + parameters + "",
                                values,
                            function(error) {
                                connection.release();
                                if (error) {
                                    return callback("Error de acceso a la base de datos");
                                }
                                else callback(null);

                            });
                        }
                        else{
                            callback(null);
                        }
                    }
                });
            }
        });
    }
    
    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection){
            if (err) {
                return callback("Error de conexión a la base de datos");
            } else {
                connection.query(
                    "UPDATE task SET done = 1 WHERE id = ?",
                    [idTask],
                function(error) {

                    if (error) {
                        return callback("Error de acceso a la base de datos");
                    }
                    else callback(null);
                });
            }
        });
    }
    
    deleteCompleted(email, callback){
        this.pool.getConnection(function(err, connection){
            if (err) { 
                return callback("Error de conexión a la base de datos");
            } else {
                connection.query(
                    "DELETE FROM task WHERE user = ? AND done = 1",
                    [email],
                function(error) {

                    if (error) {
                        return callback("Error de acceso a la base de datos");
                    }
                    else {
                        callback(null)
                    }
                });
            }
        });
    }
    
}

module.exports = DAOTasks;
