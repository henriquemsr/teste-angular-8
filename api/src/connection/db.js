const { password } = require('../.env');
module.exports = () => {
    const Sequilize = require('sequelize');
    const sequelize = new Sequilize('F8vpB86uRb', 'F8vpB86uRb', password, {
        port: '3306',
        host: 'remotemysql.com',
        dialect: 'mysql'
    })
    let connect = false;
    //metodo para autenticar
    sequelize.authenticate().then(() => {
        connect = true;
    }).catch((erro) => {
        connect = false;
    })
    return [connect, sequelize];
}