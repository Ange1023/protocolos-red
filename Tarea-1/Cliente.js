const { ClientProtocol } = require("./Protocolo");
const readline = require("readline");


    const client = new ClientProtocol("localhost", 5000);

    try {
  
    client.connect();
        
  
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
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

