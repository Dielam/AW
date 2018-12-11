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
                        "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?",
                        [email, password],
                        function(err, result){
                            if(err){
                                callback("Error de acceso a la base de datos", null, false);
                            }
                            else{
                                let size = result.length;
                                if(size != 0){
                                    callback(err, result[0].id, true);
                                }
                                else{
                                    callback(err, null, false);
                                }
                            }
                        }
                    )
                }

            });
	}

	getUserImageName(id, callback){
            this.pool.getConnection(function(err, connection){
                if(err){
                    callback("Error de conexión a la base de datos");
                }
                else{
                    connection.query(
                        "SELECT imagen FROM usuarios WHERE id = ?",
                        [id],
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
    
    insertUser(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "INSERT INTO usuarios(email, contraseña, nombre, sexo, fecha, imagen) VALUES(?, ?, ?, ?, ?, ?)",
                    [user.email, user.password, user.name, user.gender, user.date, user.img],
                    function(err, result){
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null, result.insertId);
                    }
                );
            }
        });
    }
}

module.exports = DAOUsers;