const {Sequelize, DataTypes}=require('sequelize');
const db = new Sequelize('user','postgres','qwert@123',{
    host:'localhost',
    dialect:'postgres',

});

const User = require('./user')(db, DataTypes);
db.User = User;
module.exports=db;