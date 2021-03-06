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
                                    callback(err, result[0].id, result[0].puntos, true);
                                }
                                else{
                                    callback(err, null, null, false);
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
                                id: id,
                                email: result[0].email,
                                password: result[0].contraseña,
                                name: result[0].nombre,
                                date: new Date(result[0].fecha),
                                gender: result[0].sexo,
                                img: result[0].imagen,
                                pts: result[0].puntos 
                            };
                            let ageDifMs = Date.now() - user.date.getTime();
                            var ageDate = new Date(ageDifMs);
                            user.age = Math.abs(ageDate.getUTCFullYear() - 1970);
                                                        
                            let dd = user.date.getDate();
                            let mm = user.date.getMonth()+1;
                            let yyyy = user.date.getFullYear();
                            if(dd < 10){
                                dd = '0' + dd
                            } 
                            if(mm < 10){
                                mm = '0' + mm
                            } 
                            user.date = yyyy + '-' + mm + '-' + dd;
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
                connection.query(
                    "SELECT * FROM usuarios WHERE email = ?",
                    [user.email],
                    function(err, result){
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            if(result.length > 1) return callback(null, true);
                            else{
                                if(user.img != null){
                                    console.log(user);
                                    connection.query(
                                        "UPDATE usuarios SET email = ?, contraseña = ?, nombre = ?, sexo = ?, fecha = ?, imagen = ? WHERE id = ?",
                                        [user.email, user.password, user.name, user.gender, user.date, user.img, user.id],
                                        function(err, result){
                                            connection.release();
                                            if(err) return callback("Error de acceso a la base de datos");
                                            else return callback(null, null);
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
                                            else return callback(null, null);
                                        }
                                    );
                                }
                            }
                        }
                    }
                );
            }
        });
    }
    
    insertUser(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT * FROM usuarios WHERE email = ?",
                    [user.email],
                    function(err, result){
                        if(err != null) return callback("Error de acceso a la base de datos");
                        else if(result[0] != null) return callback(null, false);
                        else{
                            connection.query(
                                "INSERT INTO usuarios(email, contraseña, nombre, sexo, fecha, imagen, puntos) VALUES(?, ?, ?, ?, ?, ?, 0)",
                                [user.email, user.password, user.name, user.gender, user.date, user.img],
                                function(err, result){
                                    connection.release();
                                    if(err) return callback("Error de acceso a la base de datos");
                                    else return callback(null, result.insertId);
                                }
                            );
                        }
                    }
                )
            }
        });
    }

    searchUser(id, search, callback){
        let arrayContacts = [];
        search = "%" + search + "%";
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT id, nombre FROM usuarios WHERE usuarios.id <> ? AND nombre LIKE ? AND NOT EXISTS (SELECT * FROM amigos WHERE (usuario1 = ? OR usuario2 = ?) AND (usuario1 = usuarios.id OR usuario2 = usuarios.id))",
                    [id, search, id, id],
                    function(err, filas){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            filas.forEach(element => {
                                    arrayContacts.push({
                                            "id"	        : element.id,
                                            "nombre"        : element.nombre
                                    });
                            });
                            return callback(null, arrayContacts);
                        }
                    }
                );
            }
        });
    }

    addPoints(id, actualPoints, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                actualPoints += 50;
                connection.query(
                    "UPDATE usuarios SET puntos = ? WHERE id = ?",
                    [actualPoints, id],
                    function(err, result){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null, actualPoints);
                    }
                );
            }
        });
    }
}

module.exports = DAOUsers;