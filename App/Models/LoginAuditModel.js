const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("../Databases/ModelBuilder.js");

class LoginAuditModel extends require('../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'login_audit';
        this.primaryKey = 'la_id';

        this.columns = {
            la_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            la_ip_address: {
                ...ModelColumn,
                type: DataTypes.STRING,
            },
            la_success: {
                ...ModelColumn,
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },
            la_username: {
                ...ModelColumn,
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            la_with_password: {
                ...ModelColumn,
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },
            la_datetime: {
                ...ModelColumn,
                type: DataTypes.DATE
            }
        }
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new LoginAuditModel(), sequelize)

