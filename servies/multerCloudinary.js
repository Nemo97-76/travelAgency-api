import multer from 'multer'
import { allowedExtentions } from '../utilies/allawedExtentions.js'
export const multerCloudFunction = (allowedExtentionsArray) => {
    if (!allowedExtentions) {
        allowedExtentionsArray = allowedExtentions.image && allowedExtentions.vedios
    }
    const storage = multer.diskStorage({})
    const fileFilter = (req, file, cb) => {
        if (allowedExtentionsArray.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error('invalid extention,the allowed extentions are:1=>for vedios (mp4,mkv) ,2=>for images (png,jpeg,gif)', { cause: 400 }), false)
    }
    const fileUpload = multer({
        fileFilter,
        storage,
        limits: { fields: 3, files: 3 }
    })
    return fileUpload
}
