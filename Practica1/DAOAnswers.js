"use strict";

let pool;

class DAOAnswers{
    constructor(pool){
        this.pool = pool;
    }

    getAnswersOfQuestion(id, callback){
        this.pool.getConnection(function(err, connection){
            let arrayAnswer = [];
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT idRespuesta, respuesta FROM respuestas WHERE idPregunta = ?",
                    [id],
                    function(err, filas){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else{
                            filas.forEach(element => {
                                let pos = arrayAnswers.findIndex(object =>{
                                    return element.usuario1 == object.id || element.usuario2 == object.id;
                                });
                                if(pos == -1){
                                    arrayAnswer.push({
                                            "id"	        : element.idRespuesta,
                                            "respuesta"        : element.respuesta
                                    });
                                }
                            });
                            return callback(null, arrayAnswer);
                        }
                    }
                )
            }
        });
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