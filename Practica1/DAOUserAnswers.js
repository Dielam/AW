"use strict";

let pool;

class DAOUserAnswers{
    constructor(pool){
        this.pool = pool;
    }

    getCorrectAnswerForUsers(usersList, userId, questionId, callback){
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
                connection.query(
                    "SELECT idRespuesta respuestaCorrecta, idUsuarioPregunta FROM respuestas_usuarios WHERE idUsuarioPregunta IN ("+ auxQueryString +") AND idUsuarioResponde IN ("+ auxQueryString +") AND idUsuarioPregunta = idUsuarioResponde",
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
                                        "respuestaCorrecta" : element.respuestaCorrecta,
                                });
                            });
                            return callback(null, arrayUserAndAnswer);
                        }
                    }
                );
            }
        });
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
                        console.log(filas);
                        connection.release();
                        if(error) return callback("Error de acceso a la base de datos");
                        else{
                            return callback(null, filas);
                        }
                    }
                )
            }
        })
    }
    
    insertUserAnswer(idPregunta, idRespuesta, userPregunta, userRespuesta, callback){
        this.pool.getConnection(function(err, connection){
            if(error) return callback("Error de acceso a la base de datos");
            else{
                connection.query(
                    "INSERT INTO respuestas_usuarios(idPregunta, idRespuesta, idUsuarioPregunta, idUsuarioResponde) VALUES(?, ?, ?, ?)",
                    [idPregunta, idRespuesta, userPregunta, userRespuesta],
                    function(err){
                        if(error) return callback("Error de acceso a la base de datos");
                        else return callback(null);
                    }
                );
            }
        });
    }

}

module.exports = DAOUserAnswers;