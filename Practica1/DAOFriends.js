"use strict";

let pool;

class DAOFriends{
	constructor(pool){
	this.pool = pool;
	}

    getFriendsData(user, callback){
        let arrayContacts = [];
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT usuario1, usuario2, US1.nombre nombre1, US2.nombre nombre2, confirmación FROM amigos, usuarios US1, usuarios US2 WHERE (usuario1 = ? OR usuario2 = ?) AND (usuario1 = US1.id AND usuario2 = US2.id)",
                    [user, user],
                    function(err, filas){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            filas.forEach(element => {
                                let pos = arrayContacts.findIndex(object =>{
                                    return element.usuario1 == object.id || element.usuario2 == object.id;
                                });
                                if(pos == -1){
                                    console.log(element.usuario1,element.usuario2,element.confirmación)
                                    arrayContacts.push({
                                            "id"	        : element.usuario1 == user ? element.usuario2 : element.usuario1,
                                            "nombre"        : element.usuario1 == user ? element.nombre2 : element.nombre1,
                                            "confirmacion"	: element.usuario1 == user && element.confirmación != 1 ? 0 : element.confirmación
                                    });
                                }
                            });
                            return callback(null, arrayContacts);
                        }
                    }
                );
            }
        });
    }

    insertFriend(usuario1, usuario2, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT * FROM amigos WHERE usuario1 <> ? AND usuario2 <> ? AND usuario1 <> ? AND usuario2 <> ?",
                    [usuario1, usuario1, usuario2, usuario2],
                    function(err, result){
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            let size = result.length;
                            if(size == 0){
                                connection.query(
                                    "INSERT INTO amigos(usuario1, usuario2) VALUES (?, ?)",
                                    [usuario1, usuario2],
                                    function(err){
                                        connection.release();
                                        if(err) return callback("Error de acceso a la base de datos");
                                        else return callback(null);
                                    }
                                )
                            }
                            else{
                                return callback(null);
                                console.log("Ya son amigos");
                            } 
                        }
                    }
                );
            }
        });
    }

    acceptFriend(usuario1, usuario2, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "UPDATE amigos SET confirmación = 1 WHERE usuario1 = ? AND usuario2 = ?",
                    [usuario1, usuario2],
                    function(err){
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null)
                    }
                );
            }
        });
    }

    declineFriend(usuario1, usuario2, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "DELETE FROM amigos WHERE usuario1 = ? AND usuario2 = ?",
                    [usuario1, usuario2],
                    function(err){
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null)
                    }
                );
            }
        });
    }
}

module.exports = DAOFriends;