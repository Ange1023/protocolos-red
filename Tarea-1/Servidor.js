const {ServerProtocol} = require("./Protocolo");
const morse = require('morsa').default;
const fs = require('fs');

const content = 'Hola mundo';
const ruta = './test.txt';
const msg = `Escoge una operacion a realizar:
  OP1. Enviar un correo 
  OP2. Crear un archivo 
  OP3. Borrar un archivo 
  OP4. Traducir código morse 
  Escribe 'exit' para salir`;


handleMessage = (message) => {

      switch (message.header) {
      case "OP1":
        if (!message.body) return
        sendEmail(message)
        break;
      case "OP2":
        if (!message.body) return
        createFile(ruta, content);
      break;
      case "OP3": 
      if (!message.body) return
        deleteFile(ruta);
      break;
      case "OP4":
        if (!message.body) return
        translateMorse(message);
      default:
          return msg;
    }
  
}
sendEmail = (obj)=>{
  return `Correo enviado a: ${obj}`; 
}
createFile = (ruta,content)=>{
  fs.writeFile(ruta, content,  (err) => {
    if (err) {
        return console.log(err);
    }
    return "Archivo creado exitosamente"
  });
}
deleteFile = (obj)=>{
  try {
    fs.unlinkSync(obj)
    return 'Archivo eliminado exitosamente'
  } catch(err) {
    return 'Error, no se pudo eliminar el archivo'
  }
}
translateMorse = (obj)=>{
    const resp = morse.decode(obj);
    return resp
}

const server = new ServerProtocol(5000, handleMessage);
server.start(msg);

