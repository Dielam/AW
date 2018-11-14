"use strict";

let pool;

class DAOUsers{
	constructor(pool){
		this.pool = pool;
	}

	isUserCorrect(email, password, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				console.log(`Error al obtener la conexión: ${err.message}`);
                    callback(err, false);
			}
			else{
				connection.query(
					"SELECT * FROM user WHERE email ='"+ email +"' AND password ='"+ password +"'",
					function(err, result){
						if(err){
							console.log(`Error en la consulta: ${err.message}`);
							callback(err, false);
						}
						else{
							if(result != null){
								callback(err, true);
							}
							else{
								callback(err, false);
							}
						}
					}
				)
			}

		});
	}

	getUserImageName(email, callback){
		this.pool.getConnection(function(err, connection){
			if(err){
				console.log(`Error al obtener la conexión: ${err.message}`);
				callback(err, "");
			}
			else{
				connection.query(
					"SELECT img FROM user WHERE email = '"+ email +"'",
					function(err, result){
						if(err){
							console.log(`Error en la consulta: ${err.message}`);
                    		callback(err, " ");
						}
						else{
							if(result != null) callback(err, result);
							else callback(err, "No existe el usuario")
						}
					}
				)
			}
		});
	}
}

module.exports = DAOUsers;