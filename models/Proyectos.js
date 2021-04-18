const Sequelize = require('sequelize');
const db =require('../config/db');
const slug = require('slug');
const shortId = require('shortid');
const Proyectos = db.define('proyectos',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type:Sequelize.STRING(100)
    },

    url:{
        type:Sequelize.STRING(100)
    }
},{
    hooks:{
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortId.generate()}`;
        },
    }
});

module.exports = Proyectos;