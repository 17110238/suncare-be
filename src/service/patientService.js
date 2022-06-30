import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51LC4rKI4mP7c8dVY3ef3fTSn30ch5e3x1SJrmJwYTIEXzkeeZ7aIPZHSUoZc0TLBv6TvRfZmVs2YzVv30JGx47t7002UNF7yPT');

let postBookAppoinmentService = (data) => {
    console.log("data", data)
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
                    price: data.price,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectConfirmSheduleLink: confirmSchedule(data.doctorId, token),
                    redirectCancleSheduleLink: cancleSchedule(data.doctorId, token, data.scheduleId)
                })
                // upserts
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.gender,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                    }
                })

                let schedule = await db.Schedule.findOne({
                    where: {
                        id: +data.scheduleId
                    },
                    raw: false
                })
                if (schedule) {
                    schedule.isActive = false
                    await schedule.save()
                }
                if (user[0] && user) {
                    await db.Booking.create({
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                        priceId: data.priceId,
                        formality: data.formality
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

let confirmSchedule = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}&isConfirm=true`
    return result
}

let cancleSchedule = (doctorId, token, scheduleId) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}&isConfirm=false&scheduleId=${scheduleId}`
    return result
}

let postVerifyBookAppoinmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId || !data.isConfirm) {
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
                    appoinment.statusId = data.isConfirm === 'true' ? 'S2' : 'S4'
                    await appoinment.save()

                    // Neu huy lich hen thi mo lai thoi gian benh nhan da dat lich
                    if (data.isConfirm === 'false') {
                        const schedule = await db.Schedule.findOne({
                            where: {
                                id: +data.scheduleId
                            },
                            raw: false
                        })
                        if (schedule) {
                            schedule.isActive = true
                            await schedule.save()
                        }
                    }
                    resolve({
                        errCode: 0,
                        errMessage: data.isConfirm === 'true' ? 'Xác nhận lịch hẹn thành công!' : 'Hủy Lịch khám thành công!',
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: data.isConfirm === 'true' ? 'Lịch hẹn này đã được đặt!' : 'Lịch khám này đã được hủy!',
                    })
                }
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let handlePaymentCheckoutService = (data) => {
    return new Promise(async (resolve, reject) => {
        const { token, email, price, patientName, patientId, doctorId, date, timeType, currentDate } = data
        try {
            if (!token || !email || !price) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thanh toán thất bại!',
                })
            }
            else {
                try {
                    const appoinment = await db.Booking.findOne({
                        where: {
                            statusId: 'S5',
                            patientId,
                            doctorId,
                            date,
                            timeType
                        },
                        raw: false
                    })
                    if (appoinment) {
                        const customer = await stripe.customers.create({
                            email: token.email,
                            source: token.id,
                        });
                        const charge = await stripe.charges.create(
                            {
                                amount: +price,
                                currency: "VND",
                                customer: customer.id,
                                receipt_email: token.email,
                                description: `Da nhan tien thanh toan tu ${patientName}`,
                                shipping: {
                                    name: token.card.name,
                                    address: {
                                        line1: token.card.address_line1,
                                        line2: token.card.address_line2,
                                        city: token.card.address_city,
                                        country: token.card.address_country,
                                        postal_code: token.card.address_zip,
                                    },
                                },
                            },
                        );
                        if (charge) {
                            if (appoinment) {
                                appoinment.statusId = 'S3'
                                await appoinment.save()

                                await db.Order.create({
                                    doctorId,
                                    patientId,
                                    date: currentDate,
                                    total: price,
                                    unit: charge.currency
                                })
                            }

                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Thanh toán thành công!',
                        })
                    }
                    else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Hóa đơn này đã được thanh toán!',
                        })
                    }
                }
                catch (error) {
                    console.error("Error:", error);
                    resolve({
                        errCode: 1,
                        errMessage: 'Thanh toán thất bại!',
                    })
                }
            }
        }
        catch (err) {
            resolve({
                errCode: 1,
                errMessage: 'Thanh toán thất bại!',
            })
        }
    })
}

module.exports = {
    postBookAppoinmentService, postVerifyBookAppoinmentService, handlePaymentCheckoutService
}