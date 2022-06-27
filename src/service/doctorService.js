import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2', isVerify: 1 },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })

        }
        catch (err) {
            reject(err)
        }

    })
}

let getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2', isVerify: 1 },
                attributes: { exclude: ['image', 'password'] }
            })

            resolve({
                errCode: 0,
                errMessage: 'Get All Doctor Success!',
                data: doctors
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

const validdateInput = (data) => {
    const objVlidate = {
        doctorId: data.doctorId,
        contentHTML: data.contentHTML,
        contentMarkdown: data.contentMarkdown,
        action: data.action,
        selectedPrice: data.selectedPrice,
        selectedPayment: data.selectedPayment,
        selectedProvince: data.selectedProvince,
        nameClinic: data.nameClinic,
        addressClinic: data.addressClinic,
        specialtyId: data.specialtyId
    }
    Object.values(objVlidate).every(value => {
        if (!value) {
            return false
        }
    })
    return true
}

let saveDetailInfoDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const valid = validdateInput(inputData)
            if (!valid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                if (inputData.action === 'CREATE') {
                    //upsert to Markdown table
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description
                    }
                    await doctorMarkdown.save()
                }

                // upsert to table Doctor_Info
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })

                if (doctorInfo) {
                    // update 
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice
                    doctorInfo.paymentId = inputData.selectedPayment
                    doctorInfo.provinceId = inputData.selectedProvince
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.note = inputData.note
                    doctorInfo.specialtyId = inputData.specialtyId
                    doctorInfo.ClinicId = inputData.ClinicId

                    await doctorInfo.save()
                }
                else {
                    // create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor success!'
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let getDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['contentMarkdown', 'description', 'contentHTML'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Info,
                        attributes: { exclude: ['id', 'doctorId'] },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                        ]
                    },
                ],
                raw: false,
                nest: true,
            })

            if (data?.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary')
            }

            if (!data) { data = {} }

            resolve({
                errCode: 0,
                data: data
            })

        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllcodeScheduleTimeDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let scheduleTime = await db.Allcode.findAll({
                where: { type: 'TIME' },
            })
            resolve({
                errCode: 0,
                errMessage: 'Get Schudule Time Success!',
                data: scheduleTime
            })
        }
        catch (err) {
            reject(err)
        }
    }
    )
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let schedule = data.arrSchedule
                if (schedule?.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                // get All exist data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                })

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })

                if (toCreate?.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true,
                })

                if (!dataSchedule) {
                    dataSchedule = []
                }

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        }
        catch (err) {
            reject(err)
        }
    }
    )
}

let getListPriceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let prices = await db.Allcode.findAll({
                where: { type: 'PRICE' },
            })
            resolve({
                errCode: 0,
                errMessage: 'Get All Prices Success!',
                data: prices
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

let getListPaymentService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let payments = await db.Allcode.findAll({
                where: { type: 'PAYMENT' },
            })

            resolve({
                errCode: 0,
                errMessage: 'Get All Payments Success!',
                data: payments
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

let getProvinceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let provinces = await db.Allcode.findAll({
                where: { type: 'PROVINCE' },
            })

            resolve({
                errCode: 0,
                errMessage: 'Get All Provinces Success!',
                data: provinces
            })
        }
        catch (err) {
            reject(err)
        }
    })
}

let getProfileDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentMarkdown', 'description', 'contentHTML'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                })

                if (data?.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) { data = {} }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let getListPatientForDoctorService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender', 'phoneNumber'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn']
                                },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        },
                        {
                            model: db.Allcode, as: 'priceDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let handleConfirmAndPaymentPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.patientId || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false,
                })
                if (data.action === 'confirm') {
                    if (appointment) {
                        appointment.statusId = 'S5'
                        await appointment.save();
                        await emailService.paymentOrder({
                            receiverEmail: data.email,
                            patientName: data.patientName,
                            language: data.language,
                            paymentOrderLink: paymentOrderLink(data.patientName, data.phoneNumber, data.currentDate, data.email, data.price, data.doctorName, data.timeSchudle, data.doctorId, data.patientId, data.timeType),
                        }) // send email to confirm doctor

                        resolve({
                            errCode: 0,
                            errMessage: data.language === 'vi' ? 'Xác nhận thông tin thành công và đã gửi hóa đơn đến người dùng.' : 'Confirm the information successfully and have sent the invoice to the user.'
                        })
                    }
                }
                if (data.action === 'cancel') {
                    const schedule = await db.Schedule.findOne({
                        where: {
                            doctorId: data.doctorId,
                            timeType: data.timeType,
                            date: data.date
                        },
                        raw: false
                    })

                    if (schedule) {
                        schedule.isActive = true
                        await schedule.save()
                    }
                    appointment.statusId = 'S4'
                    await appointment.save();
                    await emailService.cancleScheduleFromDoctor({
                        receiverEmail: data.email,
                        patientName: data.patientName,
                        language: data.language,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: data.language === 'vi' ? 'Xác nhận hủy lịch thành công !' : 'Cancellation confirmation successful!'
                    })
                }
            }
        }
        catch (err) {
            console.log("err", err)
            reject(err)
        }
    })
}

let paymentOrderLink = (patientName, phoneNumber, date, email, price, doctorName, timeSchudle, doctorId, patientId, timeType) => {
    let result = `${process.env.URL_REACT}/payment-order?patientName=${encodeURIComponent(patientName)}&doctorId=${encodeURIComponent(doctorId)}&patientId=${encodeURIComponent(patientId)}&timeSchudle=${encodeURIComponent(timeSchudle)}&phoneNumber=${encodeURIComponent(phoneNumber)}&date=${encodeURIComponent(date)}&email=${encodeURIComponent(email)}&price=${encodeURIComponent(price)}&doctorName=${encodeURIComponent(doctorName)}&timeType=${timeType}`
    return result
}

module.exports = {
    getDoctorHomeService, getAllDoctorService, saveDetailInfoDoctorService, getDoctorByIdService, getAllcodeScheduleTimeDoctorService,
    bulkCreateScheduleService, getScheduleByDateService, getListPriceService, getListPaymentService, getProvinceService,
    getProfileDoctorByIdService, getListPatientForDoctorService, handleConfirmAndPaymentPatientService
}
