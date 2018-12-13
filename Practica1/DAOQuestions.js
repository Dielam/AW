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
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos", arrayQuestions);
                        else{
                            filas.forEach(element => {
                                let pos = arrayQuestions.findIndex(object =>{
                                    return element.usuario1 == object.id || element.usuario2 == object.id;
                                });
                                if(pos == -1){
                                    arrayQuestions.push({
                                            "id"	        : element.id,
                                            "pregunta"        : element.pregunta
                                    });
                                }
                            });
                            return callback(null, arrayQuestions);
                        }
                    }
                );
            }
        });
    }

    insertQuestion(question, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "INSERT INTO preguntas(pregunta) VALUES (?)",
                    [question],
                    function(err, result){
                        connection.release();
                        if(err) return callback("Error de acceso a la base de datos");
                        else callback(null, result.insertId);
                    }
                );
            }
        });
    }

}

module.exports = DAOQuestions;