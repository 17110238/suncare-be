'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {

        static associate(models) {
            Order.belongsTo(models.Doctor_Info, { foreignKey: 'doctorId' })
            Order.belongsTo(models.User, { foreignKey: 'patientId' })
        }
    };
    Order.init({
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        total: DataTypes.FLOAT,
        unit: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};