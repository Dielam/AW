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

                                    arrayContacts.push({
                                            "id"	        : element.usuario1 == user ? element.usuario2 : element.usuario1,
                                            "nombre"        : element.usuario1 == user ? element.nombre2 : element.nombre1,
                                            "confirmacion"	: element.confirmación
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
}

module.exports = DAOFriends;