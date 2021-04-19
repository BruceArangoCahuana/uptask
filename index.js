const express = require('express');
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const passport = require('./config/passport')
//extarer valores de variables de entorno
require('dotenv').config({path:'variables.env'});
//funciones de ayuda herlpers

const helpers = require('./herlpers');

//crear conexion a la base de datos
const db = require('./config/db');

//importamos el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
    db.sync()
    .then(()=>console.log("conectado"))
    .catch((e)=>console.log(e))

//crear una aplicacion en express
const app = express();

app.use(express.static('public'))

//habilitar pug
app.set("view engine","pug")

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}))

app.use(expressValidator());



//añadir las carpetas de las vistas
app.set("views",path.join(__dirname, "./views"))
//agregar flash-message
app.use(flash());
app.use(cookieParse())
// sessiones nos permite navegar en distintas paginas sin autenticarnos
app.use(session({
    secret:'supersecret',
    resave:false,
    saveUninitialized:false
}));
//passport
app.use(passport.initialize());
app.use(passport.session());
//var_dump a la aplication
app.use((req,res,next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null
    console.log(res.locals.usuario);
    next();
});

//vista principal
app.use("/",routes());

//correr puerto
app.listen(3000);

//Servidor y puerto
const host  = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port,host,()=>{
    console.log("El servidor esta funcionando ahora")
})