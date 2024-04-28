const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("./../Databases/ModelBuilder.js");

class UserModel extends require('./../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'users';
        this.primaryKey = 'user_id';

        this.columns = {
            user_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            user_username: {
                ...ModelColumn,
                type: DataTypes.STRING,
                _uniqueIndex: true
            },
            user_password: {
                ...ModelColumn,
                type: DataTypes.STRING
            },
            user_access_type: {
                ...ModelColumn,
                type: DataTypes.STRING
            }
        }
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new UserModel(), sequelize)

