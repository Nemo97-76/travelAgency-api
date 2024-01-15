//TODO: APIs for Add,Delete,update,findAll
import { customAlphabet } from "nanoid"
import sectionModel from "../../model/section.js"
import UserModel from "../../model/user.js"
import { paginationFunc } from "../../utilies/pagination.js"
const nanoid = customAlphabet('123456_=!ascbhdtel', 7)
import cloudinary from "cloudinary"
export const addsection = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findOne({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error("not authrized", { cause: 400 }))
    }
    const { title, description } = req.query
    const section = await sectionModel.findOne({ title })
    if (section) {
        return next(new Error("title is not allowed to be doubled", { cause: 400 }))
    }
    if (!req.files) {
        return next(new Error("please upload section's pictures", { cause: 400 }))
    }
    const customId = nanoid()
    const localimages = []
    const publicids = []
    for (const file of req.files) {
        try {
            var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections/${customId}` })
        } catch (error) {
            console.log(error);
        }
        localimages.push({ secure_url, public_id })
        publicids.push(public_id)
    }
    const sectionObject = await sectionModel.create({
        images: localimages,
        AddedBy: _id,
        title,
        description,
        customId,
    })
    if (!sectionObject) {
        try {
            await cloudinary.api.delete_resorces(publicids)
        } catch (error) {
            console.log(error)
        }
        return next(new Error("fail to add section ,please try again later", { cause: 400 }))
    }
    res.status(201).json({
        message: "section added",
        sectionObject
    })
}
export const updatesec = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findById({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error("not Authrized", { cause: 400 }))
    }
    const { sectionID } = req.params
    const section = await sectionModel.findById({ _id: sectionID })
    if (!section) {
        return next(new Error("section not found", { cause: 400 }))
    }
    const { title, description } = req.query
    if (req.files) {
        const images = [...section.images]
        for (const file of req.files) {
            try {
                var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections` })
            } catch (error) {
                console.log(error);
            }
            images.push({ secure_url, public_id })
        }
        section.images = images
    }
    title ? section.title = title : section.title = section.title
    description ? section.description = description : section.section.description = section.section.description
    await section.save()
    res.status(200).json({
        message: "updated",
        section
    })
}
export const deletesec = async (req, res, next) => {
    const { title } = req.body
    const section = await sectionModel.findOne({ title })
    if (!section) {
        return next(new Error("section not found", { cause: 400 }))
    }
    for (const image of section.images) {
        try {
            await cloudinary.v2.api.delete_resources(image.public_id)
            await cloudinary.v2.api.delete_folder(`${process.env.project_folder}/sections`)
        } catch (error) {
            console.log(error);
        }
    }
    const deletsec = await sectionModel.findOneAndDelete({ title })
    deletsec ? res.status(200).json({
        message: "deleted"
    }) : next(new Error("fail to delete trip ,please try again later", { cause: 400 }))
}
export const getAllsecs = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size })
    const sections = await sectionModel.find().limit(limit).skip(skip)
    if (!sections) {
        return next(new Error('fail to restore sections , please try again later', { cause: 400 }))
    }
    res.status(200).json({
        message: "done",
        sections
    })
}