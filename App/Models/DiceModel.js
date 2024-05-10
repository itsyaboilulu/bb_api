const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("../Databases/ModelBuilder.js");

class DiceModel extends require('../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'dice';
        this.primaryKey = 'dice_id';

        this.columns = {
            dice_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            dice_type: {
                ...ModelColumn,
                type: DataTypes.STRING,
            },
            dice_value: {
                ...ModelColumn,
                type: DataTypes.INTEGER,
            },
            dice_title: {
                ...ModelColumn,
                type: DataTypes.STRING,
            },
            dice_desc: {
                ...ModelColumn,
                type: DataTypes.STRING,
            }
        }
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new DiceModel(), sequelize)

