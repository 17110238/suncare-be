
require('dotenv').config()
import nodemailer from 'nodemailer'

let setSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thong tin dat lich kham benh", // Subject line
        html: getBodyHTML(dataSend)
    })
}

let getBodyHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên SunCare!</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Tên Bác sĩ: ${dataSend.doctorName}</b> </div>
        <div><b>Thời gian: ${dataSend.time}</b> </div>
        <div><b>Giá khám: ${dataSend.price}</b> </div>
        
        <p>Nếu các thông tin trên hợp lệ, vui lòng click đường link bên dưới để xác nhận để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <a href=${dataSend.redirectConfirmSheduleLink}>Click vào link này để xác nhận đặt lịch!</a> <br/>
        <a href=${dataSend.redirectCancleSheduleLink}>Click vào link này để hủy đặt lịch!</a>

        <p>Xin chân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on SunCare!</p>
        <p>Information to book a medical appointment: </p>
        <div><b>Doctor Name: ${dataSend.doctorName}</b> </div>
        <div><b>Time: ${dataSend.time}</b> </div>
        <div><b>Price: ${dataSend.price}</b> </div>
        
        <p>If the above information is valid, please click the link below to confirm to complete the procedure to book an appointment</p>
        <a href=${dataSend.redirectConfirmSheduleLink}>Click this link to cancle your appointment!</a> <br/>
        <a href=${dataSend.redirectCancleSheduleLink}>Click this link to confirm your appointment!</a>
        <p>Sincerely thank!</p>
        `
    }

    return result
}

let confirmDoctorEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Xac nhan thong tin bac si", // Subject line
        html: getBodyConfirmDoctorHTML(dataSend)
    })
}

let getBodyConfirmDoctorHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Cảm ơn vì bạn đã đã quan tâm tới Suncare chúng tôi!</p>
        <p>Sau khi kiểm tra thông tin đăng ký của bạn đã gửi tới chúng tôi và những thông tin bạn gửi hiện đủ điều kiện để tham gia 
        vào hệ thống của chúng tôi. Chào mừng bạn đã đến với hệ thống Suncare của chúng tôi.</p>
        <p>Xin chân thành cảm ơn!</p>
        `
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>Thank you for your interest in our Suncare!</p>
        <p>After checking your registration information submitted to us and the information you submit is now eligible to participate in our system.
        Welcome to our Suncare system. </p>
          <p>Sincerely thank!</p>
        `
    }
    return result
}

let cancelDoctor = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Xac nhan thong tin bac si", // Subject line
        html: getBodyCancelDoctorHTML(dataSend)
    })
}

let getBodyCancelDoctorHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Cảm ơn vì bạn đã đã quan tâm tới Suncare chúng tôi!</p>
        <p>Sau khi kiểm tra thông tin đăng ký của bạn đã gửi tới chúng tôi và những thông tin bạn gửi hiện không đủ điều kiện để tham gia 
        vào hệ thống của chúng tôi.</p>
        <p>Xin chân thành cảm ơn!</p>
        `
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>Thank you for your interest in our Suncare!</p>
        <p>After checking your registration information has been submitted to us and the information you submit is not eligible to participate in our system.
         </p>
          <p>Sincerely thank!</p>
        `
    }
    return result
}

let registerUser = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Chao mung ban den voi SunCare!", // Subject line
        html: getBodyRegisterUserHTML(dataSend)
    })
}

let getBodyRegisterUserHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Chào mừng bạn đến với đại gia đình SunCare! Nơi sẽ giúp bạn chăm sóc sức khỏe bản thân tốt hơn, theo một cách tiện lợi hơn</p>
        <p>Một lần nữa, chào mừng và xin chân thành cảm ơn bạn. Chúc bạn một ngày an lành!</p>`
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>Welcome to SunCare! Place where can help you to take care of your health in the better way, better life</p>
        <p>Once again, thank you and wish you will have a good day!</p>
          <p>Sincerely thank!</p>
        `
    }
    return result
}

let paymentOrder = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: dataSend.language === 'vi' ? 'Vui lòng thanh toán trước khi khám bệnh!' : 'Please pay before medical examination!', // Subject line
        html: getBodyPaymentOrderHTML(dataSend)
    })
}

let getBodyPaymentOrderHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì bác sĩ đã đồng ý xác nhận thông tin đặt lịch khám bệnh online trên SunCare!</p>
        <a href=${dataSend.paymentOrderLink}>Vui lòng click vào link này </a> để thanh toán trước khi khám bệnh! <br/>
        <p>Một lần nữa, chào mừng và xin chân thành cảm ơn bạn. Chúc bạn một ngày an lành!</p>`
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because the doctor has agreed to confirm the online appointment booking information on SunCare!</p>
        <a href=${dataSend.paymentOrderLink}>Please click this link to pay before medical examination!</a> <br/>
        <p>Once again, welcome and thank you very much. Have a good day!</p>`

    }
    return result
}

let cancleScheduleFromDoctor = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: dataSend.language === 'vi' ? 'Hủy lịch khám bệnh!' : 'Cancel the appointment!', // Subject line
        html: getBodyCancleScheduleFromDoctorHTML(dataSend)
    })
}

let getBodyCancleScheduleFromDoctorHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì hiện tại Bác sĩ không thể tham gia vào buổi khám bệnh này. Vui lòng chọn thời gian khác hoặc đặt lại lịch sau!</p>
        <p>Một lần nữa, chào mừng và xin chân thành cảm ơn bạn. Chúc bạn một ngày an lành!</p>`
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because the Doctor is currently unable to attend this session. Please choose another time or reschedule later!</p>
        <p>Once again, welcome and thank you very much. Have a good day!</p>`

    }
    return result
}

let noConfirmScheduleFromDoctor = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: dataSend.language === 'vi' ? 'Không đủ điều kiện khám bệnh' : 'Not eligible for medical examination', // Subject line
        html: getBodyNoConfirmScheduleFromDoctorHTML(dataSend)
    })
}

let getBodyNoConfirmScheduleFromDoctorHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì hiện tại thông tin của bạn không đủ điều kiện để khám bệnh. Vui lòng kiểm tra lại thông tin và đăng ký lại sau.</p>
        <p>Một lần nữa, chào mừng và xin chân thành cảm ơn bạn. Chúc bạn một ngày an lành!</p>`
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because your information is not currently eligible for medical examination. Please check the information and register again later.</p>
        <p>Once again, welcome and thank you very much. Have a good day!</p>`

    }
    return result
}

let bookingCharRoom = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "<phamngoctien4321@gmail.com>", // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: dataSend.language === 'vi' ? 'Thông tin buổi khám trực tuyến' : 'Information about online examination', // Subject line
        html: getBodyCharRoom(dataSend)
    })
}

let getBodyCharRoom = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì hiện tại thông tin của bạn không đủ điều kiện để khám bệnh.</p>
        <p>Một lần nữa, chào mừng và xin chân thành cảm ơn bạn. Chúc bạn một ngày an lành!</p>`
    }
    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because your information is not currently eligible for medical examination. Please check the information and register again later.</p>
        <p>Once again, welcome and thank you very much. Have a good day!</p>`

    }
    return result
}


module.exports = {
    setSimpleEmail, confirmDoctorEmail, cancelDoctor, registerUser, paymentOrder, cancleScheduleFromDoctor, noConfirmScheduleFromDoctor, bookingCharRoom
}