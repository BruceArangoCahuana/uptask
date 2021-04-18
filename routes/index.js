const express = require("express");
const router = express.Router();
//importamos express-validator
const { body } = require('express-validator/check');

//importamos el controlador
const proyectosControllers = require("../controlllers/proyectosControllers");
const tareasControllers = require('../controlllers/tareasControllers');
const usuariosControllers = require('../controlllers/usuariosControllers');
const authControllers = require('../controlllers/authControllers') 
module.exports = function(){

    //rutas para el home
    router.get("/", 
         authControllers.usuarioAutenticado,
         proyectosControllers.proyectosHome
    );
    router.get("/nuevo-proyecto",
         authControllers.usuarioAutenticado,
         proyectosControllers.formularioProyecto
    );

    //con metodo post para el envio de informacion
    router.post("/nuevo-proyecto",
            authControllers.usuarioAutenticado,
            body('nombre').not().isEmpty().trim().escape(),
            proyectosControllers.nuevoProyecto);
    //listar proyectos
    router.get("/proyectos/:url",
       authControllers.usuarioAutenticado,
       proyectosControllers.proyectoPorUrl
    );
    //editar proyecto
    router.get("/proyecto/editar/:id",
      authControllers.usuarioAutenticado,
      proyectosControllers.formularioEditar
    );

    router.post("/nuevo-proyecto/:id",
            authControllers.usuarioAutenticado,
            body('nombre').not().isEmpty().trim().escape(),
            proyectosControllers.actualizarProyecto
        );
   //eliminar proyecto
   router.delete("/proyectos/:url",
        authControllers.usuarioAutenticado,
        proyectosControllers.eliminarProyecto
   );
   //tareas
   router.post("/proyectos/:url",
       authControllers.usuarioAutenticado, 
       tareasControllers.agregarTarea 
   );
   //actualizar tarea
   router.patch("/tareas/:id",
       authControllers.usuarioAutenticado,
       tareasControllers.actualizarEstado
   );
   //eliminar tarea
   router.delete("/tareas/:id",
       authControllers.usuarioAutenticado,    
       tareasControllers.eliminarTarea
   );
   // crear nueva cuenta
   router.get("/crear-cuenta",usuariosControllers.fromCrearcuenta);
   router.post("/crear-cuenta",usuariosControllers.crearCuenta);
   router.get("/confirmar/:correo",usuariosControllers.confirmarCuenta);
   //iniciar session
   router.get("/iniciar-session",usuariosControllers.iniciarSession);
   router.post("/iniciar-session",authControllers.autenticarUsuario);
   //cerrar session
   router.get("/cerrar-session",usuariosControllers.cerrarSession);
   //restablecer cuenta
   router.get("/restablecer",usuariosControllers.usuariosResatablecer);
   router.post("/restablecer",authControllers.enviarToken);
   router.get("/restablecer/:token",authControllers.resetPassword)
   router.post("/restablecer/:token",authControllers.resetPasswordForm);
  return router;
}
