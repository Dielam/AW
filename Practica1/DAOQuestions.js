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
                                    arrayQuestions.push({
                                            "id"	        : element.id,
                                            "pregunta"        : element.pregunta
                                    });
                            });
                            return callback(null, arrayQuestions);
                        }
                    }
                );
            }
        });
    }

    searchQuestionById(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT pregunta FROM preguntas WHERE id = ?",
                    [id],
                    function(err, result){
                        console.log(id);
                        if(err) return callback("Error de acceso a la base de datos");
                        else return callback(null, result[0].pregunta);
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