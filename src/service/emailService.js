
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
        <div><b>Thời gian: ${dataSend.time}</b> </div>
        <div><b>Tên Bác sĩ: ${dataSend.doctorName}</b> </div>
        
        <p>Nếu các thông tin trên hợp lệ, vui lòng click đường link bên dưới để xác nhận để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <a href=${dataSend.redirectLink}>Click vào link này!</a>

        <p>Xin chân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        result = `<h3> Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on SunCare!</p>
        <p>Information to book a medical appointment: </p>
        <div><b>Time: ${dataSend.time}</b> </div>
        <div><b>Doctor Name: ${dataSend.doctorName}</b> </div>
        
        <p>If the above information is valid, please click the link below to confirm to complete the procedure to book an appointment</p>
        <a href=${dataSend.redirectLink}>Click vào link này!</a>
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
        subject: "Chao mung ban den voi SunCare", // Subject line
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

module.exports = {
    setSimpleEmail, confirmDoctorEmail, cancelDoctor
}