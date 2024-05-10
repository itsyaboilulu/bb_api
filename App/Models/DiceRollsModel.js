const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("../Databases/ModelBuilder.js");

class DiceRollsModel extends require('../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'dice_rolls';
        this.primaryKey = 'roll_id';	

        this.columns = {
            roll_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            roll_roll: {
                ...ModelColumn,
                type: DataTypes.INTEGER,
            },
            roll_type: {
                ...ModelColumn,
                type: DataTypes.STRING,
            },
            roll_member: {
                ...ModelColumn,
                type: DataTypes.INTEGER,
            },
            roll_target_member: {
                ...ModelColumn,
                type: DataTypes.INTEGER,
            },
            roll_parent_roll: {
                ...ModelColumn,
                type: DataTypes.INTEGER,
            },
            roll_datetime: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
        }
    }

    //with
    secondRoll(){
        return this.hasOne(
            'DiceRollsModel',
            'roll_parent_roll',
            'roll_id',
        ) 
    }

    member(){
        return this.hasOne(
            'UserModel',
            'user_id',
            'roll_member',
        ) 
    }

    targetMember(){
        return this.hasOne(
            'UserModel',
            'user_id',
            'roll_target_member',
        ) 
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new DiceRollsModel(), sequelize)

