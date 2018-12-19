const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const mySqlSession = require("express-mysql-session");
const fs = require("fs");
const multer = require("multer");
const config = require("./config");
const DAOQuestions = require("./DAOQuestions");
const DAOUsers = require("./DAOUsers");
const DAOFriends = require("./DAOFriends");
const DAOAnswers = require("./DAOAnswers");
const DAOUserAnswers = require("./DAOUserAnswers");

// Crear servidor Express.js
const app = express();

// Configurar ejs como motor de plantillas
app.set("view engine", "ejs");

// Definir el directorio de plantillas
app.set("views", path.join(__dirname, "public", "views"));

// Crear la sesion
const mySqlStore = mySqlSession(session);

// Crear el almacen de la sesion
const sessionStore = new mySqlStore(config.mysqlConfig);

//Crear middleware middlewareSession
const middlewareSession = session({
    saveUninitialized: false,
    secret: "Pr05Y54DM1N",
    resave: false,
    store: sessionStore
});

// Creacion de factoria de multer
const multerFactory = multer({dest: path.join(__dirname, "profile_imgs/")});

// Arrancar middleware middlewareSession
app.use(middlewareSession);

// Crear middleware static
const staticFiles = path.join(__dirname, "public");

// Arrancar middleware static
app.use(express.static(staticFiles));

// Arrancar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

// Crear instancia DAOQuestions
const daoQ = new DAOQuestions(pool);

// Crear instancia DAOUsers
const daoU = new DAOUsers(pool);

// Crear instancia DAOFriends
const daoF = new DAOFriends(pool);

// Crear instancia DAOAnswers
const daoA = new DAOAnswers(pool);

// Crear instancia DAOUserAnswers
const daoUA = new DAOUserAnswers(pool);

// Middleware de comprobacion
function checkSession(request, response, next){
    if(request.session.currentUser != null){
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        app.locals.userPts = request.session.currentPts;
        next();
    }
    else response.redirect("/login");
}

// GET de login
app.get("/login", function(request, response){
    response.status(200);
    if(request.session.currentUser != null){
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        app.locals.userPts = request.session.currentPts;
        response.redirect("/profile/" + request.session.currentId);
    } 
    else{
        request.session.currentUser = null;
        app.locals.userEmail = null;
        app.locals.userId = null;
        request.session.currentId = null;
        app.locals.userPts = null;
        request.session.currentPts = null;
        response.render("login", {"errorMsg": false});
    }
});

// POST de login
app.post("/login", function(request, response){
    response.status(200);
    daoU.isUserCorrect(request.body.email, request.body.password, function(err, id, pts, ok){
        if(err){
            request.session.currentUser = null;
            app.locals.userEmail = null;
            app.locals.userId = null;
            request.session.currentId = null;
            app.locals.userPts = null;
            request.session.currentPts = null;
            response.render("login", {"errorMsg": null});
        }
        if(ok){
            request.session.currentUser = request.body.email;
            app.locals.userEmail = request.body.email;
            request.session.currentId = id;
            app.locals.userId = id;
            app.locals.userPts = pts;
            request.session.currentPts = pts;
            response.redirect("/profile/" + request.session.currentId);
        }  
        else{
            request.session.currentUser = null;
            app.locals.userEmail = null;
            request.session.currentId = null;
            app.locals.userId = null;
            app.locals.userPts = null;
            request.session.currentPts = null;
            response.render("login", {"errorMsg": null});
        }
    });
});

// GET del registro de usuario
app.get("/signUp", function(request, response){
    response.status(200);
    if(request.session.currentUser == null){
        request.session.currentUser = null;
        app.locals.userEmail = null;
        app.locals.userId = null;
        request.session.currentId = null;
        app.locals.userPts = null;
        request.session.currentPts = null;
        response.render("sign_up", {"errorMsg": false});
    }
    else{
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        app.locals.userPts = request.session.currentPts;
        response.redirect("/profile/" + request.session.currentId);
    }
});

// POST del registro de usuario
app.post("/signUp", multerFactory.single('uploadedfile'), function(request, response){
    response.status(200);
    console.log(request.file);
    if(request.session.currentUser == null){
        let user = {
            email: request.body.email,
            password: request.body.password,
            name: request.body.name,
            gender: request.body.gender,
            date: request.body.date,
            img: request.file == null ? null : request.file.filename,
        };
        daoU.insertUser(user, function(err, id){
            if(err){
                request.session.currentUser = null;
                app.locals.userEmail = null;
                app.locals.userId = null;
                request.session.currentId = null;
                app.locals.userPts = null;
                request.session.currentPts = null;
                response.render("sign_up", {"errorMsg": null});
            } 
            else{
                if(id == false){
                    request.session.currentUser = null;
                    app.locals.userEmail = null;
                    app.locals.userId = null;
                    request.session.currentId = null;
                    app.locals.userPts = null;
                    request.session.currentPts = null;
                    response.render("sign_up", {"errorMsg": true});
                }
                else{
                    app.locals.userEmail = user.email;
                    request.session.currentUser = user.email;
                    request.session.currentId = id; 
                    app.locals.userId = id;
                    app.locals.userPts = request.session.currentPts;
                    response.redirect("/profile/" + request.session.currentId)
                }
            }
        });
    }
    else{
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        response.redirect("/profile/" + request.session.currentId);
    } 
});

// GET de logout
app.get("/logout", checkSession, function(request, response){
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

// GET del perfil del usuario
app.get("/profile/:id", checkSession, function(request, response, next){
    response.status(200);
    daoU.getInfoUser(request.params.id, function(err, user){
        if(err) next(new Error(err));
        else response.render("profile", {"user": user});
    });
});

// GET de la vista de modificar usuario
app.get("/modifyProfile", checkSession, function(request, response, next){
    response.status(200);
    daoU.getInfoUser(app.locals.userId, function(err, user){
        if(err) next(new Error(err));
        else response.render("modify_profile", {"user": user});
    });
});

// POST de modificar perfil
app.post("/modifyProfile", checkSession, multerFactory.single('uploadedfile'), function(request, response, next){
    let user = {
        id: app.locals.userId,
        email: request.body.email,
        password: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        date: request.body.date,
        img: request.file == null ? null : request.file.filename
    };
    if(user.email != null && user.password != null && user.name != null){
        daoU.updateUser(user, function(err){
            if(err) next(new Error(err));
            else response.redirect("/profile/"+ request.session.currentId);
        });
    }
    else response.redirect("/profile/"+ request.session.currentId);
});

// GET de userImage
app.get("/userImage/:id", function(request, response){
    response.status(200);
    daoU.getUserImageName(request.params.id, function(err, img){
        if(img != null && fs.existsSync(path.join(__dirname, "profile_imgs", img))){
            response.sendFile(path.join(__dirname, "profile_imgs", img));
        }
        else{
            response.sendFile(path.join(__dirname, "profile_imgs", "Noprofile.jpg"));
        }    
    });
});

// GET de la vista friends.ejs
app.get("/friends", checkSession, function(request, response, next){
    response.status(200);
    daoF.getFriendsData(request.session.currentId, function(err, contactsList){
        if(err) next(new Error(err));
        else response.render("friends", {"contactsList": contactsList});
    })
});

// GET de la peticion de amistad
app.get("/friendship_request/:id", checkSession, function(request, response, next){
    response.status(200);
    daoF.insertFriend(app.locals.userId, request.params.id, function(err){
        if(err) next(new Error(err));
        else response.redirect("/friends"); 
    });
});

// GET de aceptar una peticion  de amistad
app.get("/acceptFriendInv/:id", checkSession, function(request, response, next){
    response.status(200);
    daoF.acceptFriend(request.params.id, app.locals.userId, function(err){
        if(err) next(new Error(err));
        else response.redirect("/friends");
    });
});

// GET de rechazar una peticion de amistad
app.get("/declineFriendInv/:id", checkSession, function(request, response, next){
    response.status(200);
    daoF.declineFriend(request.params.id, app.locals.userId, function(err){
        if(err) next(new Error(err));
        else response.redirect("/friends");
    });
});

// POST de la búsqueda de amigos
app.post("/friendsSearch", checkSession, function(request, response, next){
    response.status(200);
    daoU.searchUser(app.locals.userId, request.body.searcher, function(err, searchList){
        if(err) next(new Error(err));
        else{
            let search={
                contactsList: searchList,
                searcher: request.body.searcher
            }
            response.render("friends_search", {"search" : search});
        }
    });
});

// GET de la vista de preguntas
app.get("/questions", checkSession, function(request, response, next){
    response.status(200);
    daoQ.getAllQuestions(function(err, questionsArray){
        if(err) next(new Error(err));
        else{
            let i = 0;
            let pos;
            let size = questionsArray.length;
            let questionsList = [];
            while(i < 5){
                pos = Math.floor(Math.random() * size);
                if(!questionsList.includes(questionsArray[pos])){
                    questionsList[i] = questionsArray[pos]
                    i++;
                }
            }
            response.render("questions", {"questionsList": questionsList}); 
        }
    });
});

// GET de la vista de detalle de pregunta
app.get("/questionDetails/:id", checkSession, function(request, response, next){
    response.status(200);
    daoF.getFriendsData(app.locals.userId, function(err, contactsList){
        if(err) next(new Error(err));
        else {
            friendsList = contactsList.filter(contact =>{
                if(contact.confirmacion) return true;
                else return false;
            })
            daoUA.getCorrectAnswerForUsers(friendsList, app.locals.userId,request.params.id, function(error, correctAnswersList){
                if(error) next(new Error(error));
                else{
                    if(correctAnswersList != null){ 
                        daoUA.getMyAnswers(app.locals.userId, request.params.id, function(MAError, myAnswersList){
                            if(MAError) next(new Error(error));
                            else{
                                let finalContactsList = [];
                                correctAnswersList.forEach(element =>{
                                    let resultado = null;
                                    let i = 0;
                                    let encontrado = false;
                                    while(i < myAnswersList.length && encontrado == false){
                                        if (myAnswersList[i].idUsuario === element.idUsuario && myAnswersList[i].miRespuesta === element.respuestaCorrecta) {
                                            resultado = 1;
                                            encontrado = true;
                                        }
                                        else if(myAnswersList[i].idUsuario === element.idUsuario && myAnswersList[i].miRespuesta != element.respuestaCorrecta){
                                            resultado = 0;
                                            encontrado = true;
                                        }
                                        else i++;
                                    }
                                    finalContactsList.push({
                                        "id"        : element.idUsuario,
                                        "nombre"    : element.nombreUsuario,
                                        "resultado" : resultado
                                    })
                                });
                                daoQ.searchQuestionById(request.params.id, function(SQError, questionName){
                                    if(SQError) next(new Error(error));
                                    else{
                                        daoUA.getMyAnswerForMyself(app.locals.userId, request.params.id, function(AFMError, answerForMyself){
                                            if(AFMError) next(new Error(error));
                                            else{
                                                if(answerForMyself == null) answerForMyself = null;
                                                else answerForMyself = answerForMyself.respuesta;
                                                response.render("question_detail", {"contactsList":finalContactsList, "questionTitle":questionName, "questionId": request.params.id, "myAnswer": answerForMyself});
                                            }
                                        })
                                    }
                                });
                            }
                        })
                    }
                    else{
                        daoQ.searchQuestionById(request.params.id, function(SQError, questionName){
                            if(SQError) next(new Error(error));
                            else{
                                daoUA.getMyAnswerForMyself(app.locals.userId, request.params.id, function(AFMError, answerForMyself){
                                    if(AFMError) next(new Error(error));
                                    else{
                                        if(answerForMyself == null) answerForMyself = null;
                                        else answerForMyself = answerForMyself.respuesta;
                                        response.render("question_detail", {"contactsList":null, "questionTitle":questionName, "questionId": request.params.id, "myAnswer": answerForMyself});
                                    }
                                })
                            }
                        });
                    }
                }
            })
        }
    });
});

// GET de responder preguntas
app.get("/addQuestion", checkSession, function(request, response){
    response.status(200);
    response.render("add_question",{"errorMsg": null});
});

// POST del formulario de añadir preguntas de la vista question.ejs
app.post("/addQuestion", function(request, response, next){
    response.status(200);
    if(request.body.new_question != null && request.body.answer1 != null && request.body.answer2 != null && request.body.answer3 != null && request.body.answer4 != null){
        daoQ.insertQuestion(request.body.new_question, function(err, id){
            if(err) next(new Error(err));
            else{
                let answers = []
                answers.push(request.body.answer1);
                answers.push(request.body.answer2);
                answers.push(request.body.answer3);
                answers.push(request.body.answer4);
                daoA.insertAnswers(id, answers, function(err){
                    if(err) next(new Error(err));
                    else response.redirect("/questions");
                });
            }
        });
    }
    else response.render("add_question", {"errorMsg": true});
});

// GET de la vista de contestar una pregunta para uno mismo
app.get("/answerQuestion/:id", checkSession, function(request, response, next){
    response.status(200);
    daoA.getAnswersOfQuestion(request.params.id, function(err, answerList){
        if(err) next(new Error(err));
        else{
            daoQ.searchQuestionById(request.params.id, function(err, text){
                if(err) next(new Error(err));
                else{
                    let question = {
                        idPregunta : request.params.id,
                        friendId : null,
                        friendName : null,
                        pregunta: text,
                        answersList: answerList
                    };
                    response.render("answer_question", {"question": question});
                }
            });
        }
    });
});

// POST del formulario de la vista de contestar una pregunta para uno mismo
app.post("/answerQuestion/:id", checkSession, function(request, response, next){
    response.status(200);
    if(request.body.answer != null && request.body.answer != "other"){
        daoUA.insertUserAnswer(request.params.id, request.body.answer, app.locals.userId, app.locals.userId, function(err){
            if(err) next(new Error(err));
            else response.redirect("/questions"); 
        });
    }
    else{
        if(request.body.other_answer != ""){
            daoA.insertAnswer(request.params.id, request.body.other_answer, function(err, idAnswer){
                if(err) next(new Error(err));
                else{
                    daoUA.insertUserAnswer(request.params.id, idAnswer, app.locals.userId, app.locals.userId, function(err){
                        if(err) next(new Error(err));
                        else response.redirect("/questions"); 
                    });
                }
            });
        }
        else response.redirect("/questions");
    }

});

// GET de la vista de adivinar una respuesta de un amigo
app.get("/guessQuestion/:idPregunta/:friendId/:friendName", checkSession, function(request, response, next){
    response.status(200);
    daoA.getAnswersOfQuestion(request.params.idPregunta, function(err, answerList){
        if(err) next(new Error(err));
        else{
            daoUA.searchAnswerByUserQuestion(request.params.idPregunta, request.params.friendId, function(err, idCorrect){
                if(err) next(new Error(err));
                else{
                    let i = 0;
                    let pos;
                    let size = answerList.length;
                    let answersArray = [];
                    let posCorrect = Math.floor(Math.random() * size);
                    let aux = answerList.findIndex(o =>{ return o.id == idCorrect });
                    answersArray[posCorrect] = answerList[aux];
                    console.log(answerList[aux]);
                    while(i < 4){
                        if(i == posCorrect) i++;
                        else{
                            pos = Math.floor(Math.random() * size);
                            aux = answersArray.findIndex(o =>{ 
                                if(o != null) return o.id == answerList[pos].id
                                else return false;
                            })
                            if(aux == -1){
                                answersArray[i] = answerList[pos]
                                i++;
                            }
                        }
                    }
                    daoQ.searchQuestionById(request.params.idPregunta, function(err, text){
                        if(err) next(new Error(err));
                        else{
                            let question = {
                                idPregunta : request.params.idPregunta,
                                friendId : request.params.friendId,
                                friendName : request.params.friendName,
                                pregunta: text,
                                answersList: answersArray
                            };
                            response.render("answer_question", {"question": question});
                        }
                    });
                }
            });
        }
    });
});

// POST de la vista de adivinar una respuesta de un amigo
app.post("/guessQuestion/:idPregunta/:idFriend", checkSession, function(request, response, next){
    response.status(200);
    daoUA.insertUserAnswer(request.params.idPregunta, request.body.answer, request.params.idFriend, app.locals.userId, function(err){
        if(err) next(new Error(err));
        else{
            daoUA.searchAnswerByUserQuestion(request.params.idPregunta, request.params.idFriend, function(err, answer){
                if(err) next(new Error(err));
                else{
                    if(answer == request.body.answer){ 
                        daoU.addPoints(app.locals.userId, function(err){
                            if(err) next(new Error(err));
                            else response.redirect("/questions");
                        });
                    }
                    else{
                        response.redirect("/questions");
                    }
                }
            });
        } 
    });
});

// Manejador del error
app.use(function(error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error", {
        mensaje: error.message,
        pila: error.stack
    });
});


// Gestión de error 404
app.use(function(request, response, next) {
    response.status(404);
    response.render("not_found", { url: request.url });
});

// Arrancar servidor
app.listen(config.port, function(err){
    if(err) console.log("ERROR al iniciar el servidor");

    else console.log(`Servidor arrancado en el puerto ${config.port}`);
});