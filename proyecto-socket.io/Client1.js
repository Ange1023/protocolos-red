const { io } = require("socket.io-client");
const readline = require("readline");


    socket = io("http://localhost:3000", {
        reconnection: false,
    });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function iniciarChat() {
    rl.setPrompt(` \nEscribe un mensaje: `);
    rl.prompt();

    rl.on("line", (input) => {

        if (input === "exit") {
            socket.disconnect();
            rl.close();
            return;
        }

        socket.emit("data", input);
        
    });
}

socket.on("connect", () => {
    console.log(`Conectado al servidor con ID: ${socket.id}`);
    iniciarChat();
});

socket.on("data", (msg) => {
    console.log('\n'+ msg + '\n');
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
    rl.close();
});