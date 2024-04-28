const Sequelize = require("sequelize");
const Constants = require("../../constants.js");
const getDatabase = require("./getDatabase.js");

class Models {
    constructor() {
        this.serializer = this.getSerializer();
    }

    getSerializer() {
        return getDatabase();
    }

    getModel(modelName) {
        if(modelName.indexOf('Model')<1){
            modelName = `${modelName}Model`;
        }

        let model = require(`../../App/Models/${(modelName)}.js`);
        return model(this.serializer);
    }

    syncModels(force = false) {
        var fs = require('fs');
        var files = fs.readdirSync('./App/Models/');
        files.forEach(modelName => {
            if (modelName !== 'Models.js' && modelName !== 'ModelBuilder.js' && modelName !== 'Model.js'){
                let model = require(`./${(modelName)}`);
                model(this.serializer).getModel().sync({force});
            }
        })
    }
}

module.exports = new Models();