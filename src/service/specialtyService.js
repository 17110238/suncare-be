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


let getDetailSpecialtyService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing requried parameter!"
                })
            }
            else {

                let data = await db.Specialty.findOne({
                    where: { id: idInput },
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


module.exports = {
    saveNewSpecialtyService, getAllSpecialtyService, getDetailSpecialtyService
}