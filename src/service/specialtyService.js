import db from '../models/index'

let saveNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.image || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing requried parameter!"
                })
            }
            else {
                await db.Specialty.create(
                    {
                        name: data.name,
                        image: data.image,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown
                    }
                )

                resolve({
                    errCode: 0,
                    errMessage: "Save a new Specialty success!"
                })
            }
        }
        catch (err) {
            reject(err);
        }
    })
}


let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Specialty.findAll({
                limit: 10,
                order: [['createdAt', 'ASC']]
            })

            if (data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary')
            }

            resolve({
                errCode: 0,
                data: data
            })
        }
        catch (err) {
            reject(err);
        }
    })
}


let getDetailSpecialtyService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing requried parameter!"
                })
            }
            else {

                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['image']
                    }
                })

                resolve({
                    errCode: 0,
                    errMessage: "Save a new Specialty success!",
                    data: data
                })
            }
        }
        catch (err) {
            reject(err);
        }
    })
}

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing requried parameter!"
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['contentHTML', 'contentMarkdown']
                })

                if (data) {
                    let doctorSpeciaty = []
                    if (location === 'ALL') {
                        doctorSpeciaty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                        console.log("doctorSpeciaty", doctorSpeciaty)
                    } else {
                        doctorSpeciaty = await db.Doctor_Info.findAll({
                            where: { specialtyId: inputId, provinceId: location },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpeciaty = doctorSpeciaty
                }
                else { data = {} }
                console.log("data", data)
                resolve({
                    errCode: 0,
                    errMessage: "Save a new Specialty success!",
                    data
                })
            }
        }
        catch (err) {
            reject(err);
        }
    })
}


module.exports = {
    saveNewSpecialtyService, getAllSpecialtyService, getDetailSpecialtyService, getDetailSpecialtyByIdService
}