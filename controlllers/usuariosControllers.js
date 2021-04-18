const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
exports.fromCrearcuenta = (req,res,next)=>{
    res.render("crearCuenta",{
        nombrePagina:'Crear cuenta en Uptask'
    })
}

exports.crearCuenta = async (req,res,next) =>{
    //leer datos
    const{email,password} = req.body;
    try {
        await Usuarios.create({email,password});
        //generar URL de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //crear el objeto de usuario 
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo:'confirmar-cuenta'
        })
        //redirigir al usuario
        req.flash('correcto','Se envio un correo confirma tu cuenta');
        res.redirect('iniciar-session');
    } catch (error) {
        req.flash('error',error.errors.map(error=>error.message));
        res.render("crearCuenta",{
            mensajes:req.flash(),
            nombrePagina:'Crear cuenta en Uptask',
            email,
            password
        })
    }    
}
exports.iniciarSession = (req,res,next) =>{
    const {error} = res.locals.mensajes
    res.render('iniciarSession',{
        nombrePagina:'Inisiar session Uptask',
        error
    })
}
exports.cerrarSession = (req,res,next) =>{
  req.session.destroy(()=>{
      res.redirect('/iniciar-session')//nos manda a la pàgina principal
  })
}

exports.usuariosResatablecer = (req,res,next) =>{
    res.render("restablecer",{
        nombrePagina:'Restablecer cuenta en Uptask'
    })
}
exports.confirmarCuenta = async (req,res,next) =>{
    const usuario = await Usuarios.findOne({where:{email:req.params.correo}})
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Tu cuenta esta activada');
    res.redirect('/iniciar-session');
}