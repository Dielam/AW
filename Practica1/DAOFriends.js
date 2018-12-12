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

module.exports = DAOFriends;