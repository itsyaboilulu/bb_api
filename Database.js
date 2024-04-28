const Sequelize = require('sequelize');
const Constants = require('./constants.js');

const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsPath = path.join(__dirname, 'App/Models');

fs.readdir(modelsPath, function (err, files) {
    files.forEach(function (file) {
        import(`./App/Models/${file}`);
    });
})

