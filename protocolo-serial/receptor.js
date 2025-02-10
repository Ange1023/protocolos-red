const { SerialPort } = require('serialport');
const fs = require('fs');

const receiver = new SerialPort({ path: 'COM3', baudRate: 9600 });

const outputFilePath = './archivos-bin/archivo_recibido.bin';


receiver.on('data', (data) => {

    console.log(`Recibido ${data.length} bytes...`);
    
    if (data) { 

        console.log('Recepción completada.');

        fs.writeFileSync(outputFilePath, data, (err) => {
            if (err) {
                console.error('Error al escribir archivo:', err);
            } else {
                console.log(`Archivo guardado en ${outputFilePath}.`);
            }
        
        });
        receiver.close();
    }
});

receiver.on('open', () => {
    console.log('Puerto COM3 abierto. Esperando datos...');
});
