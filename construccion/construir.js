const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const webpackConfigPath = path.resolve(process.cwd(), "webpack.config.js");
const webpackConfig = require(webpackConfigPath);

module.exports = function() {
    console.log("Construyendo API desde: " + webpackConfigPath);
    return new Promise((ok, fail) => {
        webpack(webpackConfig, (error, stats) => {
            if(error || stats.hasErrors()) {
                const info = stats.toJson();
                if(stats.hasWarnings()) {
                    console.error("Warnings on webpacking:", info.warnings);
                }
                if(stats.hasErrors()) {
                    console.error("Errors on webpacking:", info.errors);
                }
                return fail(error);
            }
            const outputFile = path.resolve(webpackConfig.output.path, webpackConfig.output.filename);
            const outputFile2 = path.resolve(process.cwd(), "testeo/estatico/ranas-db.js");
            console.log("Webpacking exitoso:", outputFile);
            console.log("Exportando a:", outputFile2);
            fs.copyFileSync(outputFile, outputFile2);
            return ok([stats]);
        });
    });
};