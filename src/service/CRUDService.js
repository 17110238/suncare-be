import bcrypt from "bcryptjs"
import db from '../models/index'

const salt = bcrypt.genSaltSync(10)

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPasswordFromBycrypt = await hasUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hasPasswordFromBycrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                address: data.address,
                roleId: data.roleId,
            })
            resolve('ok! create a new user success!')
        }
        catch (err) {
            reject(err)
        }
    })
}

let hasUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hasPassword = await bcrypt.hashSync(password, salt)
            resolve(hasPassword)
        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            })
            resolve(users)
        }
        catch (err) {
            reject(err)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }, raw: false
            })
            if (user) {
                user.firstName = data.firstName,
                    user.lastName = data.lastName,
                    user.address = data.address;
                await user.save()
                resolve()
            }
            else {
                resolve()
            }

        }
        catch (err) {
            reject(err)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await db.User.destroy({
                    where: { id: userId }
                })
            }
            resolve()
        }
        catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    createNewUser, getAllUser, getUserInfoById, updateUser, deleteUser
}