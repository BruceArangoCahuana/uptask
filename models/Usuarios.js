const  Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Agrega un Correo Vàlido'
            },
            notEmpty:{
                msg:'El Email no Puede ir Vacio'
             }
        },
        unique:{
            args:true,
            msg:'Usuario ya Registrado'
        }
    },
    password:{
        type:Sequelize.STRING(60),
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'El Password no Puede ir Vacio'
            }
        }
    },
    activo:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    token:{
        type:Sequelize.STRING
    },
    expiracion:{
        type:Sequelize.DATE
    }
},{
    hooks:{
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password ,bcrypt.genSaltSync(10))
        },
    }
});
//metodo personalizado
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
//hasMany  de uno a muchos ose un usuario  puede crear muchos proyectos
Usuarios.hasMany(Proyectos);
module.exports = Usuarios;