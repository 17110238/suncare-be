import doctorService from '../service/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) {
        limit = 10
    }
    try {
        let response = await doctorService.getDoctorHomeService(+limit)
        return res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server!"
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorService()
        return res.status(200).json(doctors)
    }
    catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1, errMessage: 'Error from Server'
        })
    }
}

let postInfoDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctorService(req.body)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1, errMessage: 'Error from Server!'
        })
    }
}

let getDoctorByID = async (req, res) => {
    try {
        let id = req.query.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter!',
            })
        }

        let info = await doctorService.getDoctorByIdService(id)
        return res.status(200).json(info)
    }
    catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1, errMessage: 'Error from Server!'
        })
    }
}

let getAllcodeScheduleTimeDoctor = async (req, res) => {
    try {
        let schulde = await doctorService.getAllcodeScheduleTimeDoctorService()
        return res.status(200).json(schulde)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json(info)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let date = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date, req.query.formality)
        return res.status(200).json(date)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getListPrice = async (req, res) => {
    try {
        let listPrices = await doctorService.getListPriceService()
        return res.status(200).json(listPrices)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getListPayment = async (req, res) => {
    try {
        let listPayments = await doctorService.getListPaymentService()
        return res.status(200).json(listPayments)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getProvince = async (req, res) => {
    try {
        let listProvince = await doctorService.getProvinceService()
        return res.status(200).json(listProvince)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let profileDoctor = await doctorService.getProfileDoctorByIdService(req.query.id)
        return res.status(200).json(profileDoctor)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        const doctorId = req.query.doctorId
        const date = req.query.date
        let profileDoctor = await doctorService.getListPatientForDoctorService(doctorId, date)
        return res.status(200).json(profileDoctor)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let handleConfirmAndPaymentPatient = async (req, res) => {
    try {
        const data = req.body
        let profileDoctor = await doctorService.handleConfirmAndPaymentPatientService(data)
        return res.status(200).json(profileDoctor)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let handleBookMeetingRoom = async (req, res) => {
    try {
        const data = req.body
        let meeting = await doctorService.handleBookMeetingRoomService(data)
        return res.status(200).json(meeting)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}


module.exports = {
    getTopDoctorHome, getAllDoctor, postInfoDoctors, getDoctorByID, getAllcodeScheduleTimeDoctor, bulkCreateSchedule, getScheduleByDate,
    getListPrice, getListPayment, getProvince, getProfileDoctorById, getListPatientForDoctor, handleConfirmAndPaymentPatient,
    handleBookMeetingRoom
}