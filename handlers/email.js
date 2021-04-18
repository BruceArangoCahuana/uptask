const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailCongfi  = require('../config/email');

  let transporter = nodemailer.createTransport({
    host: emailCongfi.host,
    port: emailCongfi.port,
    auth: {
      user: emailCongfi.user, // generated ethereal user
      pass: emailCongfi.pass, // generated ethereal password
    }
  });
  //generar html
  const generarHTML = (archivo,opciones={}) =>{
    const html = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`,opciones);
    return juice(html);
  }
  // send mail with defined transport object
  exports.enviar = async (opciones)=>{
    const html = generarHTML(opciones.archivo,opciones);
    const text = htmlToText.fromString(html);
    let info ={
        from: 'Uptask <no-replay@example.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // plain text body
        html// html body
      };
      const enviarEmail = util.promisify(transporter.sendMail,transporter);
      return enviarEmail.call(transporter,info)
     
  }
 
   