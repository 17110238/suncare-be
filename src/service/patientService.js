import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let postBookAppoinmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.name) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }

            else {
                let token = uuidv4()
                await emailService.setSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.name,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                // upsert
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    }
                })

                if (user[0] && user) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info patient success!',
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postVerifyBookAppoinmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }

            else {

                let appoinment = await db.Booking.findOne({
                    where: {
                        statusId: 'S1',
                        token: data.token,
                        doctorId: data.doctorId
                    },
                    raw: false
                })

                if (appoinment) {
                    appoinment.statusId = 'S2'

                    await appoinment.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appoinment success!',
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!',
                    })
                }

            }
        }
        catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    postBookAppoinmentService, postVerifyBookAppoinmentService
}