"use strict";

let pool;

class DAOUserAnswers{
    constructor(pool){
        this.pool = pool;
    }

    getCorrectAnswerForUsers(usersList, userId, questionId, callback){
        if(usersList.length != 0){
            let arrayUserAndAnswer = [];
            let usersIds = [];
            let auxQueryString = "";
            this.pool.getConnection(function(err, connection){
                if (err) return callback("Error de conexión a la base de datos", usersList);
                else{
                    usersList.forEach((user,index) =>{
                        usersIds.push(user.id);
                        auxQueryString += "?";
                        if(index < usersList.length-1) auxQueryString += ",";
                    })
                    usersIds = usersIds.concat(usersIds);
                    usersIds.push(questionId);
                    connection.query(
                        "SELECT idRespuesta respuestaCorrecta, idUsuarioPregunta FROM respuestas_usuarios WHERE idUsuarioPregunta IN ("+ auxQueryString +") AND idUsuarioResponde IN ("+ auxQueryString +") AND idUsuarioPregunta = idUsuarioResponde AND idPregunta = ?",
                        usersIds,
                        function(error, filas){
                            connection.release();
                            if(error) return callback("Error de acceso a la base de datos", usersList);
                            else{
                                filas.forEach(element => {
                                    let userName = "";
                                    let i = 0;
                                    let encontrado = false;
                                    while(i < usersList.length && encontrado == false) {
                                        if (usersList[i].id === element.idUsuarioPregunta) {
                                            userName = usersList[i].nombre;
                                            encontrado = true;
                                        }
                                        else i++;
                                    }
                                    arrayUserAndAnswer.push({
                                            "idUsuario"	        : element.idUsuarioPregunta,
                                            "nombreUsuario"     : userName,
                                            "respuestaCorrecta" : element.respuestaCorrecta
                                    });
                                });
                                return callback(null, arrayUserAndAnswer);
                            }
                        }
                    );
                }
            });
        }
        else return callback(null, null);
    }

    getMyAnswers(userId, questionId, callback){
        let arrayAnswers = [];
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT idRespuesta, idUsuarioPregunta FROM respuestas_usuarios WHERE idUsuarioPregunta <> ? AND idUsuarioResponde = ? AND idPregunta = ?",
                    [userId, userId, questionId],
                    function(error, filas){
                        connection.release();
                        if(error) return callback("Error de acceso a la base de datos");
                        else{
                            filas.forEach(element =>{
                                arrayAnswers.push({
                                    "idUsuario"     : element.idUsuarioPregunta,
                                    "miRespuesta"   : element.idRespuesta
                                })
                            })
                            return callback(null, arrayAnswers);
                        }
                    }
                )
            }
        })
    }

    getMyAnswerForMyself(userId, questionId, callback){
        console.log("starting");
        this.pool.getConnection(function(err, connection){
            console.log("connection");
            if(err) return callback("Error de conexión a la base de datos");
            else{
                console.log("pre query");
                connection.query(
                    "SELECT respuesta FROM respuestas_usuarios RU, respuestas R WHERE idUsuarioPregunta = ? AND idUsuarioResponde = ? AND RU.idPregunta = ? AND RU.idRespuesta = R.idRespuesta",
                    [userId, userId, questionId],
                    function(error, result){
                        console.log("result", result);
                        connection.release();
                        if(error) return callback("Error de acceso a la base de datos");
                        else{
                            return callback(null, result[0]);
                        }
                    }
                )
            }
        })
    }
    
    insertUserAnswer(idPregunta, idRespuesta, userPregunta, userRespuesta, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "INSERT INTO respuestas_usuarios(idPregunta, idRespuesta, idUsuarioPregunta, idUsuarioResponde) VALUES(?, ?, ?, ?)",
                    [idPregunta, idRespuesta, userPregunta, userRespuesta],
                    function(error){
                        connection.release();
                        if(error) return callback("Error de acceso a la base de datos");
                        else return callback(null);
                    }
                );
            }
        });
    }

    searchAnswerByUserQuestion(idPregunta, idUsuarioPregunta, callback){
        this.pool.getConnection(function(err, connection){
            if(err) return callback("Error de conexión a la base de datos");
            else{
                connection.query(
                    "SELECT idRespuesta FROM respuestas_usuarios WHERE idPregunta = ? AND idUsuarioPregunta = ? AND idUsuarioResponde = ?",
                    [idPregunta, idUsuarioPregunta, idUsuarioPregunta],
                    function(error, result){
                        connection.release();
                        if(error) return callback("Error de acceso a la base de datos");
                        else return callback(null, result[0].idRespuesta);
                    }
                );
            }
        });
    }

}

module.exports = DAOUserAnswers;