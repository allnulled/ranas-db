const path = require("path");

module.exports = function() {
    return new Promise((ok, fail) => {
        const pathToFiles = [
            path.resolve(process.cwd(), "codigo", "**/*.js"),
            path.resolve(process.cwd(), "construccion", "**/*.js"),
        ];
        require("chokidar").watch(pathToFiles).on("change", function(event, file) {
            require(__dirname + "/construir.js")().then(() => console.log("Re-construido codigo..."));
        });
    });
};