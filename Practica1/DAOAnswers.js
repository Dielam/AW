"use strict";

let pool;

class DAOAnswers{
    constructor(pool){
        this.pool = pool;
    }

    insertAnswers(id, answers, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                answers.forEach(element => {
                    connection.query(
                        "INSERT INTO respuestas(idPregunta, respuesta) VALUES (?, ?)",
                        [id, element],
                        function(err, result){
                            if(err) return callback("Error de acceso a la base de datos");
                        }
                    );
                });
                connection.release();
                return callback(null);
            }
        });
    }

}

module.exports = DAOAnswers;