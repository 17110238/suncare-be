import patientService from '../service/patientService'

let postBookAppoinment = async (req, res) => {
    try {
        let bookApp = await patientService.postBookAppoinmentService(req.body)
        return res.status(200).json(bookApp)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let postVerifyBookAppoinment = async (req, res) => {
    try {
        let verify = await patientService.postVerifyBookAppoinmentService(req.body)
        return res.status(200).json(verify)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

let handlePaymentCheckout = async (req, res) => {
    try {
        let verify = await patientService.handlePaymentCheckoutService(req.body)
        return res.status(200).json(verify)
    }
    catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server!'
        })
    }
}

module.exports = {
    postBookAppoinment, postVerifyBookAppoinment, handlePaymentCheckout
}