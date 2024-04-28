const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("./../Databases/ModelBuilder.js");

class ReasonsModel extends require('./../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'reasons';
        this.primaryKey = 'reason_id';

        this.columns = {
            reason_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            reason_name: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            reason_icon: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
        }
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new ReasonsModel(), sequelize)

