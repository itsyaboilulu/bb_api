const Constants = require("../../constants.js");
const Sequelize = require("sequelize");

const testConnection = async (_sequelize) => {
    let tables = await
        _sequelize.query(
            "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;"
        )
}

module.exports = function(){
    let _sequelize = new Sequelize(
        Constants.sql.database,
        Constants.sql.user,
        Constants.sql.password,
        {
            host: Constants.sql.host,
            dialect: Constants.sql.dialect,
            pool: Constants.sql.pool,
            define: { timestamps: false },
            ...Constants.sql[Constants.sql.dialect]
        }
    )
    _sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');

        //testConnection(_sequelize);
       
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

    return _sequelize;
}