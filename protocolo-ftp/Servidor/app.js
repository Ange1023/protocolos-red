const express = require('express');
const path = require('path');
const fs = require('fs');
const {start,upload,download} = require('./ftp-cliente.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../Cliente'));

app.get('/', (req, res) => {
    
    res.sendFile("../Cliente/index.html");
});

app.get('/archivos', async (req, res) => {

    await start();

    const carpeta = path.join(__dirname, 'archivos-ftp'); 
    
    fs.readdir(carpeta, (err, files) => {
    
        if (err) {
        console.error('Error leyendo la carpeta de archivos:', err);
        res.status(500).json({ error: 'Error leyendo la carpeta de archivos' });
        return;
    }
        res.json(files);
    });
});

app.post('/download', async (req, res) => {

    const {fileName} = req.body;

    await download(fileName);
    res.status(200).send();
});

app.post('/upload', async (req, res) => {

    const {fileName} = req.body;

    await upload(fileName);
    res.status(200).send();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
