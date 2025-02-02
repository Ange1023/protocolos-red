const { handleProtocol } = require("./Protocolo");
const readline = require("readline");

let client = null;

try {
        
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });


    rl.question("Escoge un protocolo (tcp/udp): ", (protocol) => {
        client = handleProtocol(protocol);
    });

    rl.on("line", (input) => {
        if (input.toUpperCase() === "EXIT") {
            console.log("Desconectando...");
            rl.close();
            client.disconnect();
        return;
    }

    try {
    
        client.sendCommand(input);

    } catch (err) {
        console.error("Error:", err.message);
    }
    });
    } catch (err) {
    console.error("Error:", err.message);
    }

