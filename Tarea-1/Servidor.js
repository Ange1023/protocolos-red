const {ServerTCP,ServerUDP} = require("./Protocolo");
const Morsa = require('morsa').default;
const tp = require('./Transporter');
const fs = require('fs');

const morse = new Morsa();

const msg = `Escoge una opción siguiendo el formato
  1. Enviar un correo (OP1$$email::subject::content)
  2. Crear un archivo (OP2$$path::content)
  3. Borrar un archivo (OP3$$path)
  4. Traducir código morse (OP4$$text)
  Escribe 'exit' para salir`;

handleMessage = async ({header,body}) => {

      switch (header.command) {
      case "OP1":
        return await sendEmail(body)
      case "OP2":
        return await createFile(body);
      case "OP3": 
        return await deleteFile(body);
      case "OP4":
        return await translateMorse(body);
      default:
          return msg;
    }
  
}

//Enviar correo
sendEmail = ({email,subject,content})=>{

  tp.sendMail(email,subject,content);

  return `Correo enviado a: ${email} con asunto: ${subject} y contenido: ${content}`; 
}

//Crear file
createFile = ({path,content})=>{
  fs.writeFile(path, content,  (err) => {
    if (err) {
        return console.log(err);
    }
  });
  return "Archivo creado exitosamente"
}

//Borrar file
deleteFile = ({path})=>{
  try {
    fs.unlinkSync(path)
    return 'Archivo eliminado exitosamente'
  } catch(err) {
    return 'Error, no se pudo eliminar el archivo'
  }
}

//Traducir morse
translateMorse = ({text})=>{
    console.log("Traduciendo código morse...");

    return morse.decode(text);
}

const serverTCP = new ServerTCP(5000, "localhost",handleMessage);
const serverUDP = new ServerUDP(4000, "localhost", handleMessage);
serverTCP.start(msg);
serverUDP.start(msg);
