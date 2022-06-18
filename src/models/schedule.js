'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {

        static associate(models) {
            Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' })
            Schedule.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' })
        }
    };
    Schedule.init({
        currentNumber: DataTypes.INTEGER,
        maxNumber: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        isActive: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};