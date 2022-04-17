import db from '../models/index'
import bcrypt from "bcryptjs"

const salt = bcrypt.genSaltSync(10)

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkEmail(email)
            if (isExist) {
                let user = await db.User.findOne({ where: { email: email }, attributes: ['email', 'roleId', 'password', 'firstName'], raw: true },)
                const validPassword = await bcrypt.compareSync(password, user.password)
                if (validPassword) {
                    userData.errCode = 0
                    userData.errMessage = 'Login success!'
                    delete user['password']
                    userData.user = user
                    resolve(userData)
                }
                else {
                    userData.errCode = 1
                    userData.errMessage = 'Wrong PassWord!'
                    resolve(userData)
                }
            }
            else {
                userData.errCode = 1
                userData.errMessage = 'Your Email are not exist in your system. Please try again!'
                resolve(userData)
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let checkEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })

            if (user) resolve(true)
            else resolve(false)
        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }
        catch (err) {
            reject(err)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkEmail(data.email)

            if (check === false) {
                let hasPasswordFromBycrypt = await hasUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hasPasswordFromBycrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    address: data.address,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.image
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already is used, Please try other email!'
                })
            }
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

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    message: "The user dose not exist!"
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                message: "The user has been deleted"
            })

        }
        catch (err) {
            reject(err)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: "Missing required parameter!"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName,
                    user.address = data.address,
                    user.roleId = data.roleId,
                    user.positionId = data.positionId,
                    user.gender = data.gender,
                    user.phoneNumber = data.phoneNumber;
                if (data.image) {
                    user.image = data.image
                }
                await user.save()

                resolve({
                    errCode: 0,
                    message: " Update the user success!"
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: "User not found!"
                })
            }

        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllCodeService = (typeInupt) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInupt) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing requried parameter!"
                })
            }
            else {
                let res = {}
                let allcode = await db.Allcode.findAll(
                    { where: { type: typeInupt } }
                )
                res.errCode = 0
                res.data = allcode
                resolve(res)
            }
        }
        catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    handleUserLogin, getAllUsers, createNewUser, deleteUser, updateUser, getAllCodeService
}