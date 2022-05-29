// import db from '../models/index'
import UserService from '../service/UserService'

let handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await UserService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 0, errMessage: 'Missing required parameters', users: []
        })
    }

    let users = await UserService.getAllUsers(id)
    return res.status(200).json({
        errCode: 0, errMessage: 'ok', users
    })
}

let handleCreateNewUser = (req, res) => {
    setTimeout(async () => {
        let message = await UserService.createNewUser(req.body)
        return res.status(200).json(message)
    }, 1000);
}

let handleEditUser = async (req, res) => {
    let data = req.body
    let edit = await UserService.updateUser(data)
    return res.status(200).json(edit)
}

let handleDeleteUser = async (req, res) => {
    let id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 1, errMessage: 'Missing required parameters'
        })
    }
    let deleteUser = await UserService.deleteUser(id)
    return res.status(200).json(deleteUser)
}

let getAllCode = async (req, res) => {

    try {
        let data = await UserService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    }
    catch (err) {
        console.error('Get All Code Error: ' + err.message)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let confirmDoctor = async (req, res) => {
    try {
        let { doctorId } = req.body
        let profileDoctor = await UserService.handleConfirmDoctor(doctorId)
        return res.status(200).json(profileDoctor)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}


module.exports = {
    handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser, getAllCode, confirmDoctor
}