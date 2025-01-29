
const net = require("net");
const fm = require("./FormatMessage")

class ServerProtocol {
  constructor(port = 5000, handleMessage) {
    this.port = port;
    this.handleMessage = handleMessage; 
  }

  start(msg) {
    const server = net.createServer((socket) => {

      console.log("Cliente conectado");
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
        console.log("Cerrando el servidor...");
        server.close();
      });
    });
      
    server.listen(this.port, () => {
      console.log(`Servidor escuchando en el puerto ${this.port}`);
    });
  }
}


class ClientProtocol {
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

module.exports = {
  ServerProtocol,
  ClientProtocol,
};
