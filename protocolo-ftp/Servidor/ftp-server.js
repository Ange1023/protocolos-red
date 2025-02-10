const FtpSrv = require("ftp-srv");

const HOST = `ftp://127.0.0.1:21`;


const ftpServer = new FtpSrv(HOST,{
    anonymous: false, 
    pasv_url: "127.0.0.1",
    pasv_min: 1024,
    pasv_max: 65535,
});


ftpServer.on("login", ({username, password }, resolve, reject) => {
    console.log(`Intento de login: ${username}`);

    if (username === "admin" && password === "12345") {
        console.log("Usuario autenticado.");
        resolve({ root: "./archivos-ftp" }); 
    } else {
        console.log("Autenticación fallida.");
        reject(new Error("Credenciales incorrectas"));
    }
});

    
ftpServer.listen().then(() => {
    console.log(`Servidor FTP en marcha en ${HOST}`);
});