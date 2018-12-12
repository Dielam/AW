"use strict";

let pool;

class DAOQuestions{
    constructor(pool){ 
        this.pool = pool;
    }

    getAllQuestions(callback){
        var arrayQuestions = [];
        this.pool.getConnection(function(err, connection){
            if (err) return callback("Error de conexión a la base de datos", arrayQuestions);
            else{
                connection.query(
                    "SELECT * FROM preguntas",
                    function(err, filas){
                        if(err) return callback("Error de acceso a la base de datos", arrayQuestions);
                        else{
                            filas.forEach(question => {
                                arrayQuestions.push({
                                    "id"	: element.id,
                                    "text"	: element.pregunta
                                });
                            });
                            return callback(null, arrayQuestions);
                        }
                    }
                );
            }
        });
    }

}

module.exports = DAOQuestions;