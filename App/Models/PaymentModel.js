const { DataTypes } = require("sequelize"); 
const { ModelColumn } = require("../Helpers/ModelHelper.js");
const ModelBuilder = require("./../Databases/ModelBuilder.js");

class PaymentModel extends require('./../Databases/Model.js') {
    constructor(){
        super();

        this.table = 'payments';
        this.primaryKey = 'payment_id';

        this.columns = {
            payment_id: {
                ...ModelColumn,
                autoIncrement: true,
                primaryKey: true
            },
            payment_reference: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            payment_type: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            payment_amount: {
                ...ModelColumn,
                type: DataTypes.DECIMAL
            },
            payment_payee: {
                ...ModelColumn,
                type: DataTypes.INTEGER
            },
            payment_notes: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            payment_date: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
            payment_datetime: {
                ...ModelColumn,
                type: DataTypes.TEXT
            },
        }
    }

    //with
    payee(){
        return this.hasOne(
            'UserModel',
            'user_id',
            'payment_payee',
        ) 
    }

}

module.exports = (sequelize=null) => new ModelBuilder(new PaymentModel(), sequelize)

