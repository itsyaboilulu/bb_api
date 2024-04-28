const DataTypes = require('sequelize/lib/data-types');
const _ = require("lodash");

module.exports = {
    ModelColumn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    ModelProps: (columns) => (
        {
            freezeTableName: true,
            indexes:[
                ..._.keys(columns).filter(i => columns[i]._index).map(i => ({
                    unique: false,
                    fields:[i]
                })),
                ..._.keys(columns).filter(i => columns[i]._uniqueIndex).map(i => ({
                    unique: true,
                    fields:[i]
                }))
            ]
        }
    )
}