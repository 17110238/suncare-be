import express from "express"
import homeController from "../controller/homeController"
import userController from "../controller/userController"
import doctorController from "../controller/doctorController"
import patientController from "../controller/patientController"
import specialtyController from "../controller/specialtyController"

let router = express.Router()

let initWebRouters = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/display-crud', homeController.displayCRUD)
    router.get('/edit-crud', homeController.editCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)
    router.post('/put-crud', homeController.putCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.post('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/get-allcode', userController.getAllCode)
    router.post('/api/confirmDoctor', userController.confirmDoctor)

    // doctor
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/top-all-doctors', doctorController.getAllDoctor)
    router.post('/api/save-info-doctors', doctorController.postInfoDoctors)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDoctorByID)
    router.get('/api/get-schedule-time', doctorController.getAllcodeScheduleTimeDoctor)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.post('/api/handle-confirm-patient', doctorController.handleConfirmAndPaymentPatient)

    router.get('/api/get-list-price', doctorController.getListPrice)
    router.get('/api/get-list-payment', doctorController.getListPayment)
    router.get('/api/get-province', doctorController.getProvince)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.post('/api/patient-book-appoinment', patientController.postBookAppoinment)
    router.post('/api/verify-book-appoinment', patientController.postVerifyBookAppoinment)

    router.post('/api/save-new-specialty', specialtyController.saveNewSpecialty)
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)

    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)


    return app.use('/', router)
}

module.exports = initWebRouters