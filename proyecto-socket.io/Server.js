const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

const io = new Server(server, {
    pingInterval: 10000,
    pingTimeout: 20000,
});

const clients = new Map();

io.on("connection", (socket) => {
    console.log(`\nCliente conectado: ${socket.id}`);
    clients.set(socket.id, socket);

    socket.on("data", (msg) => {
        console.log(`\nMensaje recibido de ${socket.id}: ${msg}`);
        socket.emit("data", `[Eco]: ${msg}`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`\nDesconectado del servidor. Razón: ${reason}`);
        clients.delete(socket.id);
    });
});

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question("\nEscribe un comando: ", (input) => {
        const [command, ...args] = input.split(" ");
        const message = args.join(" ");

        switch (command.toLowerCase()) {

            case "help":
                console.log("\n-- Lista de comandos disponibles:");
                console.log("  list               → Muestra los clientes conectados.");
                console.log("  all <mensaje>      → Envía un mensaje a todos los clientes.");
                console.log("  <clienteId> <msg>  → Envía un mensaje a un cliente específico.");
                console.log("  close              → Cierra el servidor.");
                break;

            case "list":

                if (clients.size === 0) {
                    console.log("No hay clientes conectados.");
                } else {
                    clientList();
                }
                break;

            case "all":
                if (!message) {
                    console.log("Debes escribir un mensaje para enviar a todos.");
                } else {
                    broadcastMessage(message);
                    console.log("Mensaje enviado a todos los clientes.");
                }
                break;

            case "close":
                console.log("Cerrando servidor...");
                rl.close();
                server.close(() => {
                    console.log("Servidor cerrado.");
                    process.exit(0);
                });
                return;

            default:
                if (clients.has(command)) {
                    if (!message) {
                        console.log("Debes escribir un mensaje para enviar al cliente.");
                    } else {
                        sendMessageToClient(command, message);
                        console.log(`Mensaje enviado a ${command}: ${message}`);
                    }
                } else {
                    console.log("Comando no válido o cliente no encontrado.");
                }
                break;
        }

        promptUser();
    });
}

function sendMessageToClient(clientId, message) {
    const clientSocket = clients.get(clientId);
    
    if (clientSocket) {
        clientSocket.emit("data", `[Mensaje privado]:${message}`);
    } else {
        console.log(`Cliente con ID ${clientId} no encontrado.`);
    }
}

function broadcastMessage(message) {
    io.emit("data", `[Broadcast]: ${message}`);
}

function clientList() {
    console.log("\nLista de clientes conectados:");
    for (const clientId of clients.keys()) {
        console.log(`-- ${clientId}`);
    }
}

if (require.main === module) {
    server.listen(3000, () => {
        console.log("Servidor escuchando en el puerto 3000...");
        promptUser();
    });
}