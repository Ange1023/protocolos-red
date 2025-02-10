
FileSelect = async () => {
    try {
        const response = await fetch('/archivos');
        const files = await response.json();
        const fileSelect = document.getElementById('file-select');
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener la lista de archivos:', error);
    }
}

downloadFile = async() =>{

    const fileSelect = document.getElementById('file-select');
    const selectedFile = fileSelect.value;
    if (selectedFile) {
        console.log(selectedFile);
        const data = { fileName: selectedFile };
        await fetch('/download', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(()=>{
            alert("Archivo descargado con éxito");
        }).catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert("Por favor, selecciona un archivo para descargar.");
    }
}

uploadFile = async() =>{
    
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0].name;

    if (file) {
        console.log(file);
        const data = { fileName: file };
        await fetch('/upload', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(()=>{
            alert("Archivo subido con éxito");
        }).catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert("Por favor, selecciona un archivo para cargar.");
    }

}


document.addEventListener('DOMContentLoaded', FileSelect());

