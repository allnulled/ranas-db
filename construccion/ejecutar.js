const argumentosDeComando = require("yargs").argv;

if(!argumentosDeComando.comando) {
    throw new Error("El comando «ejecutar» requiere de un parámetro «--comando» como argumento");
}

const comandoFuncion = require(__dirname + "/" + argumentosDeComando.comando + ".js");
if(typeof comandoFuncion !== "function") {
    throw new Error("El comando «ejecutar» requiere de un parámetro «--comando» reconocido.")
}
comandoFuncion(argumentosDeComando)
    .then(() => console.log("Comando ejecutado con éxito."))
    .catch(error => console.error("Comando ejecutado con errores:", error));