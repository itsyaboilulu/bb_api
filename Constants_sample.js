module.exports = {
    sql: {
        dialect: 'sqlite',
        database: '',
        user: '',
        password: '',
        host: '',
        sqlite : {
            dialect: 'sqlite',
            host: "App/Databases/database.sqlite"
        }
    },
    jwt: {
        expire: 32400, //9 hours
        secret: '123456789'
    },
}