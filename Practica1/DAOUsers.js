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
                            connection.release();
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
                            connection.release();
                            if(err){
                                callback("Error de acceso a la base de datos");
                            }
                            else{
                                let size = result.length;
                                if(size != 0) callback(err, result[0].imagen);
                                else callback("No existe el usuario");
                            }
                        }
                    )
                }
            });
    }

    getInfoUser(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT * FROM usuarios WHERE id = ?",
                    [id],
                    function(err, result){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            let user = {
                                email: result[0].email,
                                password: result[0].contraseña,
                                name: result[0].nombre,
                                date: result[0].fecha,
                                gender: result[0].sexo,
                                img: result[0].imagen,
                                pts: result[0].puntos 
                            };
                            user.date = new Date(user.date);
                            user.date = new Date(user.date.getTime() - (user.date.getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
                            return callback(null, user);
                        }
                    }
                );
            }
        });
    }

    updateUser(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                if(user.img != ""){
                    connection.query(
                        "UPDATE usuarios SET email = ?, contraseña = ?, nombre = ?, sexo = ?, fecha = ?, imagen = ? WHERE id = ?",
                        [user.email, user.password, user.name, user.gender, user.date, user.img, user.id],
                        function(err, result){
                            connection.release();
                            if(err) return callback("Error de acceso a la base de datos");
                            else return callback(null);
                        }
                    );
                }
                else{
                    connection.query(
                        "UPDATE usuarios SET email = ?, contraseña = ?, nombre = ?, sexo = ?, fecha = ? WHERE id = ?",
                        [user.email, user.password, user.name, user.gender, user.date, user.id],
                        function(err, result){
                            connection.release();
                            if(err) return callback("Error de acceso a la base de datos");
                            else return callback(null);
                        }
                    );
                }
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
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null, result.insertId);
                    }
                );
            }
        });
    }

    getFriendsData(user, callback){
        let arrayContacts = [];
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT usuario1, usuario2, confirmacion FROM amigos WHERE id = ?",
                    [user],
                    function(err, filas){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            filas.forEach(element => {
                                let pos = arrayContacts.findIndex(object =>{
                                    return element.usuario1 == object.id || element.usuario2 == object.id;
                                });
                                if(pos == -1){

                                    arrayTasks.push({
                                            "id"	        : element.usuario1 == user ? element.usuario2 : element.usuario1,
                                            "text"	        : element.text,
                                            "confirmacion"	: element.confirmacion,
                                    });
                                }
                                else{
                                    element.tag == null ? null : arrayTasks[pos].tags.push(element.tag);
                                }

                            });
                        }
                    }
                );
            }
        });
    }
}

module.exports = DAOUsers;