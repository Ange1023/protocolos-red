
const net = require("net");
const dgram = require("dgram");
const fm = require("./FormatMessage")


class ServerTCP {
  constructor(port,host, handleMessage) {
    this.port = port;
    this.host = host;
    this.handleMessage = handleMessage; 
  }

  start(msg) {
    const server = net.createServer((socket) => {

      console.log("Cliente conectado al servidor TCP");
      socket.write(msg);

      socket.on("data", async (data) => {
        const message = data.toString().trim();

        console.log("Cliente:", message);
  
        const response = await this.handleMessage(fm.formatMessage(message));
        
        if (response) {
          socket.write(response);
        }
      });

      socket.on("end", () => {
        console.log("Cliente desconectado");
        console.log("Cerrando el servidor TCP...");
        server.close();
      });
    });
      
    server.listen(this.port, () => {
      console.log(`Servidor TCP escuchando en el puerto ${this.port}`);
    });
  }
}
class ClientTCP {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = new net.Socket();
  }

  connect() {

      this.socket.connect(this.port, this.host, () => {
        console.log("Conectado al servidor");
      });

      this.socket.on("data", (data) => {
        console.log("Servidor:", data.toString().trim());
      });

 
      this.socket.on("end", () => {
        console.log("El servidor cerró la conexión.");
        process.exit(0);
      });
      this.socket.on("error", (err) => {
        throw err;
      });

  }

  sendCommand(command) {
      this.socket.write(command);
    }
  

  disconnect() {
    this.socket.end();
    console.log("Desconectado del servidor");
  }
}
class ServerUDP {
  constructor(port,host,handleMessage) {
    this.port = port;
    this.host = host;
    this.handleMessage = handleMessage;
  }

  start(msj){
    const server = dgram.createSocket("udp4");

    server.on("listening", () => {
      const address = server.address();
      console.log(`Servidor UDP escuchando en el puerto ${address.port}`);
    });

    server.on("message", async (msg, rinfo) => {
      if(msg.toString() === "init"){
        console.log("Cliente conectado al servidor UDP");
        console.log(rinfo.address, rinfo.port);
        
        server.send(msj, rinfo.port, rinfo.address, (err) => {

          if (err) {
            throw err;
          }
        });
        return;
      }
      console.log(`Cliente: ${msg.toString()}`);
      const response = await this.handleMessage(fm.formatMessage(msg.toString()));
      server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
          throw err;
        }
      });
    });

    server.on('error', (err) => {
      console.error(`server error:\n${err.stack}`);
      server.close();
    });
    
    server.bind(this.port, this.host);
  }
}
class ClientUDP {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = dgram.createSocket("udp4");
  }

  

  sendCommand(command) {
    this.socket.send(command, this.port, this.host, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  
  connect() {
    this.sendCommand("init");
    this.receiveMessage();
  }

  receiveMessage() {
    this.socket.on("message", (msg) => {
      console.log(`Servidor UDP: ${msg.toString()}`);
    });
  }

  disconnect() {
    console.log("Desconectado del servidor UDP");
    this.socket.close();
    
  }
}
const handleProtocol = (protocol)=>{

  switch(protocol.toUpperCase()){
    case "TCP":
      const clientTCP = new ClientTCP("localhost", 5000);
      clientTCP.connect();
      return clientTCP;
    case "UDP":
      const clientUDP = new ClientUDP("localhost", 4000);
      clientUDP.connect();
      return clientUDP
    
    default:
      throw new Error("No se reconoce el protocolo");
  }
}
module.exports = {
  handleProtocol,
  ServerTCP,
  ServerUDP
};
