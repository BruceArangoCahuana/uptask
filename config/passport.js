const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//modelo al cual vamos a autenticar

const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propios(email,password)

passport.use(
    new LocalStrategy(
        //por default  el passport espera un usuario y contra
        //renombramos los nombres de nuestra tabla usuario a passport
        {
            usernameField :'email',
            passwordField: 'password'
        },
        //revisa si exite el usuario
        async (email,password,done)=>{
            try {
              const usuario = await Usuarios.findOne({
                    where:{
                        email,
                        activo:1
                    }
              })  
              //el usuario existe pero el password es incorrecto
              if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'Contraseña incorrecta'
                    })   
              }
              //email correcto y contra correcto
              return done(null,usuario)
            } catch (error) {
                //el usuario no existe
                return done(null,false,{
                    message: 'Esta cuenta no existe'
                })
            }
        }
    )
)

// serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null,usuario)
})
// deserializar el usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario)
})
//exportar
module.exports = passport;