const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const mySqlSession = require("express-mysql-session");
const fs = require("fs");
const config = require("./config");
const DAOQuestions = require("./DAOQuestions");
const DAOUsers = require("./DAOUsers");
const DAOFriends = require("./DAOFriends");
const tareas = require("./DAOFriends");

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

// Middleware de comprobacion
function checkSession(request, response, next){
    if(request.session.currentUser != null){
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
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
        response.redirect("/profile");
    } 
    else{
        request.session.currentUser = null;
        app.locals.userEmail = null;
        app.locals.userId = null;
        request.session.currentId = null;
        response.render("login", {"errorMsg": false});
    }
});

// POST de login
app.post("/login", function(request, response){
    response.status(200);
    daoU.isUserCorrect(request.body.email, request.body.password, function(err, id, ok){
        if(err){
            request.session.currentUser = null;
            app.locals.userEmail = null;
            app.locals.userId = null;
            request.session.currentId = null;
            response.render("login", {"errorMsg": null});
        }
        if(ok){
            request.session.currentUser = request.body.email;
            app.locals.userEmail = request.body.email;
            request.session.currentId = id;
            app.locals.userId = id;
            response.redirect("/profile");
        }  
        else{
            request.session.currentUser = null;
            app.locals.userEmail = null;
            request.session.currentId = null;
            app.locals.userId = null;
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
        response.render("sign_up", {"errorMsg": false});
    }
    else{
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        response.redirect("/profile");
    }
});

// POST del registro de usuario
app.post("/signUp", function(request, response){
    response.status(200);
    if(request.session.currentUser == null){
        let user = {
            email: request.body.email,
            password: request.body.password,
            name: request.body.name,
            gender: request.body.gender,
            date: request.body.date,
            img: request.body.file
        };
        daoU.insertUser(user, function(err, id){
            if(err){
                request.session.currentUser = null;
                app.locals.userEmail = null;
                app.locals.userId = null;
                request.session.currentId = null;
                response.render("sign_up", {"errorMsg": null});
            } 
            else{
                app.locals.userEmail = user.email;
                request.session.currentUser = user.email;
                request.session.currentId = id; 
                app.locals.userId = id;
                response.redirect("/profile")
            }
        });
    }
    else{
        app.locals.userEmail = request.session.currentUser;
        app.locals.userId = request.session.currentId;
        response.redirect("/profile");
    } 
});

// GET de logout
app.get("/logout", checkSession, function(request, response){
    response.status(200);
    request.session.destroy();
    response.redirect("/login");
});

// GET del perfil del usuario
app.get("/profile", checkSession, function(request, response){
    response.status(200);
    daoU.getInfoUser(app.locals.userId, function(err, user){
        if(err) next(new Error(err));
        else response.render("profile", {"user": user});
    });
});

// GET de la vista de modificar usuario
app.get("/modifyProfile", checkSession, function(request, response){
    response.status(200);
    daoU.getInfoUser(app.locals.userId, function(err, user){
        if(err) next(new Error(err));
        else response.render("modify_profile", {"user": user});
    });
});

// POST de modificar perfil
app.post("/modifyProfile", checkSession, function(request, response){
    let user = {
        id: app.locals.userId,
        email: request.body.email,
        password: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        date: request.body.date,
        img: request.body.file
    };
    daoU.updateUser(user, function(err){
        if(err) next(new Error(err));
        else response.redirect("/profile");
    });
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
app.get("/friends", checkSession, function(request, response){
    response.status(200);
    daoF.getFriendsData(request.session.currentId, function(err, contactsList){
        if(err) next(new Error(err));
        else response.render("friends", {"contactsList": contactsList});
    })
});

// GET de la peticion de amistad
app.get("/friendship_request/:id", checkSession, function(request, response){
    daoF.insertFriend(app.locals.userId, request.params.id, function(err){
        if(err) next(new Error(err));
        else response.redirect("/friends"); 
    });
});

// POST de la búsqueda de amigos
app.post("/friendsSearch", checkSession, function(request, response){
    daoU.searchUser(app.locals.userId, request.body.searcher, function(err, searchList){
        if(err) next(new Error(err));
        else{
            let search={
                contactsList: searchList,
                searcher: request.body.searcher
            }
            console.log(search);
            response.render("friends_search", {"search" : search});
        }
    });
});

// GET de la vista de preguntas
app.get("/questions", function(request, response){
    response.status(200);
    userEmail = request.session.currentUser;
    daoQ.getAllQuestions(function(err, questionsList){
        console.log(err);
        if(err) next(new Error(err));
        else response.render("questions", {"questionsList": questionsList}); 
    });
});

// POST del formulario de añadir tareas de la vista tasks.ejs
app.post("/addTask", function(request, response){
    response.status(200); 
    daoT.insertTask(request.session.currentUser, tareas.createTask(request.body.new_task), function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
    });
});

// GET de marcar las tareas como finalizadas
app.get("/finish/:taskId", function(request, response){
    response.status(200);
    daoT.markTaskDone(request.params.taskId, function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
    });
});

// GET de borrar todas las tareas completadas
app.get("/deleteCompleted", function(request, response){
    response.status(200); 
    daoT.deleteCompleted(request.session.currentUser, function(err){
        if(err) next(new Error(err));
        response.redirect("/tasks");
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