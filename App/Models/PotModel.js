const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("./../Databases/ModelBuilder.js");

class PotModel extends require('./../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'pot';
        this.primaryKey = 'pot_id';

        this.columns = {
            pot_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            pot_amount: {
                ...ModelColumn,
                type: DataTypes.DECIMAL
            },
            pot_status: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            pot_created_by: {
                ...ModelColumn,
                type: DataTypes.INTEGER
            },
            pot_created_for: {
                ...ModelColumn,
                type: DataTypes.INTEGER
            },
            pot_created_datetime: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            pot_datetime: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            pot_reason_id: {
                ...ModelColumn,
                type: DataTypes.INTEGER
            },
            pot_notes: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
        }
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new PotModel(), sequelize)

