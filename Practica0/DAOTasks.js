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
                    console.log(`Error al obtener la conexión: ${err.message}`);
                    callback(err, arrayTasks);
                } else {
                    connection.query(
                        "SELECT id, text, tag, done FROM task LEFT JOIN tag ON task.id = tag.taskId WHERE user = '" + email + "'",
                        function(error, filas) {
                            connection.release();

                            if (error) {
                                    console.log('Error en la consulta a la base de datos');
                            }
                            else {
                                /*console.log(filas);*/
                                filas.forEach(element => {
                                    arrayTasks.push({
                                            "id"	: `${element.id}`,
                                            "text"	: `${element.text}`,
                                            "done"	: `${element.done}`
                                    });
                                    
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
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err);
            } else {
                connection.query(
                    "INSERT INTO task(user, text, done) VALUES ('" + email +"', '"+ task.text +"', '"+ task.done +"')",
                function(error, result) {

                    if (error) {
                            console.log('Error en la consulta a la base de datos 1 I');
                    }
                    else {
                        let values = "";
                        task.tags.forEach((element, index) => {
                            values += "(" + result.insertId +",'" + element +"')";
                            if(index !== task.tags.length - 1) values += ",";
                        });
                        connection.query(
                            "INSERT INTO tag(taskId,tag) VALUES " + values + "",
                        function(error, result) {
                            connection.release();
                            if (error) {
                                console.log('Error en la consulta a la base de datos 2 I');
                                callback(error);
                            }
                            
                        });
                    }
                });
            }
        });
    }
    
	markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection){
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err);
            } else {
                connection.query(
                    "UPDATE task SET done = 1 WHERE id = '" + idTask +"'",
                function(error, result) {

                    if (error) {
                        console.log('Error en la consulta a la base de datos 1 I');
                        callback(error);
                    }
                });
            }
        });
    }
    
	deleteCompleted(email, callback){
        this.pool.getConnection(function(err, connection){
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err);
            } else {
                connection.query(
                    "SELECT id FROM task WHERE user = '" + email + "' AND done = 1",
                function(error, filas) {

                    if (error) {
                        console.log('Error en la consulta a la base de datos 1 I');
                        callback(error);
                    }
                    else {
                        filas.forEach(element => {
                            connection.query(
                                "DELETE FROM task WHERE id = '" + element.id + "'",
                            function(errorTask, resultTask) {

                                if (errorTask) {
                                    console.log('Error en la consulta a la base de datos 1 I');
                                    callback(errorTask);
                                }
                                else {
                                    connection.query(
                                        "DELETE FROM tag WHERE taskId = '" + element.id + "'",
                                    function(errorTag, resultTag) {

                                        if (errorTag) {
                                            console.log('Error en la consulta a la base de datos 1 I');
                                            callback(errorTag);
                                        }
                                    });
                                }
                            });
                        });  
                    }
                });
            }
        });
	}
}

module.exports = DAOTasks;
