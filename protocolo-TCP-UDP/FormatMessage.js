const commands = {
    'OP1': ['email','subject','content'],
    'OP2': ['path','content'],
    'OP3': ['path'],
    'OP4': ['text'],
    'MSG': ['text']
}

formatMessage = (mensaje) => {
    const [command, content] = mensaje.split('$$');

    if (commands[command]){
        const header = { command: command };
        const body = {};
        const parts = content.split('::');

        if (commands[command].length !== parts.length) return "Datos inválidos";
        
        parts.forEach((valor, indice) => {
            body[commands[command][indice]] = valor;
        });
        return { header, body };
    }
} 

module.exports = {formatMessage};



