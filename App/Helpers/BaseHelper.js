class BaseHelper {
    constructor(props){
        this.model = null;
        this.tables = {}; 
        
        if (props?.model){
            this.model = props.model;
        }
    };

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

}

module.exports = BaseHelper;