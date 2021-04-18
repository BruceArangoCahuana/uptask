const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs')
const Op = Sequelize.Op;
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');
exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect:'/iniciar-session',
    //mostrat los errores con flash
    failureFlash:true,
    badRequestMessage: 'Ambos campos son requeridos'
});

//funcion para revisar si el user esta logeado o no
exports.usuarioAutenticado = (req,res,next)=>{
    //si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next();
    }
    //y si no
    return res.redirect('/iniciar-session');
}
//genera un token si el usuario es valido
exports.enviarToken= async (req,res,next)=>{
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where:{
        email
    }});
 

    //si no existe el usuario
    if(!usuario){
        //mostrar los errores
        req.flash('error','No existe esta cuenta')
        res.render('restablecer',{
            nombrePagina:"restablecer tu contraseña",
            mensajes:req.flash()
        });
    }
    //usuario existe

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000
   
  

    //lo guardamos en la base de datos
    //await usuario.save();
    // url de reset
    await usuario.save();
    const restUrL = `http://${req.headers.host}/restablecer/${usuario.token}`;
    
   
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer Contraseña',
        restUrL:  restUrL,
        archivo:'restablecer_password'
    })
    req.flash('correcto','Se envio mensaje a tu correo');
    res.redirect('/iniciar-session');
}
//pagina de restablecer
exports.resetPassword = async (req,res,next) =>{
    const usuario = await Usuarios.findOne({
        where:{token: req.params.token}
    });
    console.log(usuario)
    //si no encuentra el usuario
    if(!usuario){
        req.flash('error','No es Valido')
        res.redirect('/restablecer')
    }
    res.render('resPasword',{
        nombrePagina:'Restablecer Contraseña'
    })
}
//actualozar passsword
exports.resetPasswordForm = async (req,res,next)=>{
    const usuario = await Usuarios.findOne({where:{
        token:req.params.token,
        expiracion:{
            [Op.gte] : Date.now()
        }
    }})

    //si el usuario existe
    if(!usuario){
        req.flash('error','No es Valido')
        res.redirect('/restablecer')
    }
    //hashamos  contraseña
    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();
    req.flash('correcto','Contraseña Actualizado');
    res.redirect('/iniciar-session');
}