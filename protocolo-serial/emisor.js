const { SerialPort } = require('serialport');
const fs = require('fs');

const sender = new SerialPort({ path: 'COM4', baudRate: 9600 });


const filePath = './archivos-bin/archivo_texto1.bin'; 
const fileBuffer = fs.readFileSync(filePath);

const sendFile = () => {

    sender.write(fileBuffer, (err) => {
        if (err) {
            console.error('Error al enviar archivo:', err);
        } else {
            console.log('Archivo enviado correctamente.');
        }
    });
};

sender.on('open', () => {
    console.log('Puerto COM4 abierto. Enviando archivo...');
    sendFile();
});

