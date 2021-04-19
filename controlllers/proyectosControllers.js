const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

//home
exports.proyectosHome = async(req,res)=>{
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectos =  await Proyectos.findAll({where:{usuarioId:usuarioId}});
    res.render('index',{
        nombrePagina: 'Proyectos',
        proyectos
    });
}
exports.formularioProyecto = async(req,res)=>{
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectos =  await Proyectos.findAll({where:{usuarioId:usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res)=>{
    //vamos a enviar a ala consola lo que el usuario escriba
    //console.log(req.body);
    //validacion detos
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectos =  await Proyectos.findAll({where:{usuarioId:usuarioId}});
    const{nombre}=req.body;
   
    let errores = [];
    if(!nombre){
        errores.push({
            'texto':'agrega un nombre al proyecto'
        })
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar en una base de datos
     const usuarioId = res.locals.usuario.id;
     const proyecto = await Proyectos.create({nombre,usuarioId});
     res.redirect("/");
    }
}
exports.proyectoPorUrl = async(req,res,next)=>{
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectosPromise = Proyectos.findAll({where:{usuarioId:usuarioId}});

    const proyectoPromise = await Proyectos.findOne({
        where:{
            url:req.params.url,
            usuarioId
        }
    });
    const[proyectos,proyecto]= await Promise.all([proyectosPromise,proyectoPromise])
    //consultar de tarea actual
    const tareas = await  Tareas.findAll({
        where:{
            proyectoId : proyecto.id
        },
        //include :[
           // {model: Proyectos}
        //]
    })
    if(!proyecto) return next();

    //render a la vista
    res.render('tareas',{
        nombrePagina:"Tareas Proyecto",
        proyectos,
        proyecto,
        tareas
    });
}
exports.formularioEditar = async(req,res) =>{
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectosPromise = Proyectos.findAll({where:{usuarioId:usuarioId}});

   
    const nuevoPomises = await Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });

    const[proyectos,proyecto]= await Promise.all([proyectosPromise,nuevoPomises])
    //render a La vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyectos',
        proyectos,
        proyecto
    })
}
exports.actualizarProyecto = async (req,res)=>{
    //vamos a enviar a ala consola lo que el usuario escriba
    //console.log(req.body);
    //validacion detos
    const usuarioId = res.locals.usuario.id;
    //traemos los datos insertado en la db
    const proyectos =  await Proyectos.findAll({where:{usuarioId:usuarioId}});
    const{nombre}=req.body;
    console.log(nombre);

    let errores = [];
    if(!nombre){
        errores.push({
            'texto':'agrega un nombre al proyecto'
        })
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar en una base de datos
    
     await Proyectos.update(
         {
            nombre: nombre
         },
         {
            where:{id: req.params.id}
         }
         );
     res.redirect("/");
    }
}
exports.eliminarProyecto = async(req,res,next)=>{
    //lerr dato en el servidor
    //console.log(req.query)
    const {urlProyecto}=req.query;
    const resultado = await Proyectos.destroy({where:{url:urlProyecto}});
    
    if(!resultado){
        return next();
    }
   
}