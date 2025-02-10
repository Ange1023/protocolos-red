const ftp = require("basic-ftp");
const path = require("path");

let cliente = null;
const localFilePath = "../Cliente/archivos-cliente";

start = async () => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "127.0.0.1",
            port: 21,
            user: "admin",
            password: "12345",
            secure: false
        });
        cliente = client;
        console.log("Conectado al servidor FTP");
        
    } catch (err) {
        console.error("Error:", err);
    } 
}

upload = async (name) => {

    if (!cliente || !name) return;

    file = path.join(localFilePath, name);

    try {

        console.log("Subiendo archivo...");
        await cliente.uploadFrom(file,name);
        console.log("Archivo subido con éxito");
        
    } catch (err) {
        console.error("Error:", err);
    }
}

download = async (name) => {

    if (!cliente || !name) return;

    file = path.join(localFilePath, name);

    console.log("Descargando archivo...");
    
    try {
        await cliente.downloadTo(file,name);
    } catch (err) {
        console.error("Error:", err);
    }
}

module.exports = {
    start,
    upload,
    download
}
