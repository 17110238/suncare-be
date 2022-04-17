
import specialtyService from '../service/specialtyService'

let saveNewSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.saveNewSpecialtyService(req.body)
        return res.status(200).json(specialty)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyService.getAllSpecialtyService()
        return res.status(200).json(specialty)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getDetailSpecialty = async (req, res) => {
    try {
        console.log('id', req.query.id)
        let detailSpcialty = await specialtyService.getDetailSpecialtyService(req.query.id)
        return res.status(200).json(detailSpcialty)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

module.exports = {
    saveNewSpecialty, getAllSpecialty, getDetailSpecialty
}