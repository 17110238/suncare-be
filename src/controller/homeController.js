import db from '../models/index'
import CRUDService from '../service/CRUDService'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homepage.ejs', { data: JSON.stringify(data) })
    }
    catch (err) {
        console.log(err)
    }
    return res.send('Hello world from controlller')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser()
    return res.render('displayCRUD.ejs', { data })
}

let editCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId)

        return res.render('editCRUD.ejs', { userData })
    }
    else {
        return res.send('User Not Found!');
    }
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CRUDService.deleteUser(id)
        return res.send('Delete done!')
    }
    else {
        return res.send('User Not Found!');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body
    await CRUDService.updateUser(data)
    return res.send('Update done!')
}

module.exports = {
    getHomePage, getCRUD, postCRUD, displayCRUD, editCRUD, deleteCRUD, putCRUD
}