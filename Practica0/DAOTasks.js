"use strict";

const pool;

class DAOTasks {
	constructor(pool){ 
		this.pool = pool;
			
	}
	getAllTasks(email, callback){
		var arrayTasks = [];
		pool.getConnection(function(err, connection){
			if (err) {
				console.log(`Error al obtener la conexión: ${err.message}`);
				callback(err, arrayTasks);
			} else {
				connection.query(
					"SELECT id, text, tag, done FROM task, tag WHERE user = " + email + " AND id = taskId",
					function(error, filas) {
						if (error) {
							console.log('Error en la consulta a la base de datos');
						}
						else {
							filas.array.forEach(element => {
								arrayTasks.push({
									"id"	: `${element.id}`,
									"text"	: `${element.text}`,
									"done"	: `${element.done}`
								})
							});
						}
						callback(error, arrayTasks);
					}
				);
					
			}	
		})

	}
	insertTask(email, task, callback){

	}
	markTaskDone(idTask, callback){

	}
	deleteCompleted(email, callback){

	}
}

module.exports = DAOTasks;
