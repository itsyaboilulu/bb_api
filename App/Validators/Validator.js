const ErrorHelper = require('./../Helpers/ErrorHelper.js');

module.exports = class Validator {
    constructor(_errorHelper=null){
        this.ErrorHelper = _errorHelper;
        if (!_errorHelper){
            this.ErrorHelper = new ErrorHelper();
        }

        this.model = null;
        this.tables = [];
    }

    _getModel(table=null){
        //help reduce the number of new connections to db
        if (!this.model){
            this.model = require("../Databases/Models.js");
        }

        return (table) ?
            this._getTable(table) :
            this.model
    }

    _getTable(table){
        if (!this.tables[table]){
            this.tables[table] = this._getModel().getModel(table)
        }
        return this.tables[table];
    }

    validateEmail = (email) => {
        return !email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
      
    validateIsset = (e) => {
        return ( !e || e === undefined) 
    }

    validateLength = (e, length=4) => {
        return (e && e < length) || !e
    }
}