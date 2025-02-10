
const fs = require('fs');

const buffer = Buffer.from([0x48, 0x6F, 0x6C, 0x61, 0x20, 0x4D, 0x75, 0x6E, 0x64, 0x6F]);

fs.writeFileSync('archivo_texto1.bin', buffer, (err) => {
    if (err) throw err;
    console.log('El archivo binario ha sido creado y guardado como archivo.bin');
});

