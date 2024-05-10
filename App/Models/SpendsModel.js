const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("./../Databases/ModelBuilder.js");

class SpendsModel extends require('./../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'spends';
        this.primaryKey = 'spend_id';

        this.columns = {
            spend_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            spend_reference: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            spend_vender: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            spend_type: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            spend_amount: {
                ...ModelColumn,
                type: DataTypes.DECIMAL
            },
            spend_notes: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            spend_date: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            spend_datetime: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
        }
    }

    //with

}

module.exports = (sequelize=null) => new ModelBuilder(new SpendsModel(), sequelize)

