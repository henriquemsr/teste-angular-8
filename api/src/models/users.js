const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UserModel = sequelize.src.connection.db[1].define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: Sequelize.STRING(200),
        },
        email: {
            type: Sequelize.STRING(200),
        },
        telefone: {
            type: Sequelize.STRING(50),
        },
        perfil:{
            type: Sequelize.TINYINT,
        },
        password: {
            type: Sequelize.STRING(200),
        },
        token: {
            type: Sequelize.STRING(200),
        },
        date_create: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1
        }
    },
        {
            timestamps: false
        }
    )
    //UserModel.sync({ force: true })
    return UserModel;
}