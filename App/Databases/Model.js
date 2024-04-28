module.exports = class Model {
    constructor() {

    }


    hasMany(model, foreignKey, localkey = 'pk') {
        return {
            relationship: 'hasMany',
            model, foreignKey, localkey
        }
    }

    hasOne(model, foreignKey, localkey = 'pk') {
        return {
            relationship: 'hasOne',
            model, foreignKey, localkey
        }
    }

}