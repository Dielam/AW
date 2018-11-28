"use strict";

let pool;

class DAOUsers{
	constructor(pool){
	this.pool = pool;
	}

	isUserCorrect(email, password, callback){
            this.pool.getConnection(function(err, connection){
                if(err){
                    callback("Error de conexión a la base de datos", false);
                }
                else{
                    connection.query(
                        "SELECT * FROM user WHERE email = ? AND password = ?",
                        [email, password],
                        function(err, result){
                            if(err){
                                callback("Error de acceso a la base de datos", false);
                            }
                            else{
                                let size = result.length;
                                if(size != 0){
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
                    callback("Error de conexión a la base de datos");
                }
                else{
                    connection.query(
                        "SELECT img FROM user WHERE email = ?",
                        [email],
                        function(err, result){
                            if(err){
                                callback("Error de acceso a la base de datos");
                            }
                            else{
                                let size = result.length;
                                if(size != 0) callback(err, result[0].img);
                                else callback("No existe el usuario");
                            }
                        }
                    )
                }
            });
	}
}

module.exports = DAOUsers;