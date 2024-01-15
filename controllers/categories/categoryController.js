import { customAlphabet } from "nanoid";
import categoryModel from "../../model/category.js";
import cloudinary from "cloudinary"
import sectionModel from "../../model/section.js";
import UserModel from "../../model/user.js";
import { paginationFunc } from "../../utilies/pagination.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5)
//Add cate by admin
export const AddCate = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findOne({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error('not authrized', { cause: 400 }))
    }
    const { title, description, sectionID } = req.query
    const cate = await categoryModel.findOne({ title, sectionID })
    if (cate) {
        return next(new Error('title is not allwed to be doubled,please choose another title', { cause: 400 }))
    }
    const section = await sectionModel.findOne({ _id: sectionID })
    if (!section) {
        return next(new Error("section doesn't exsit", { cause: 400 }))
    }
    if (!req.files) {
        return next(new Error("please upload category's pictures", { cause: 400 }))
    }
    const customId = nanoid()
    const localimages = []
    const publicids = []
    for (const file of req.files) {
        try {
            var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections/${section.customId}/categories/${customId}` })
        } catch (error) {
            console.log(error);
        }
        localimages.push({ secure_url, public_id })
        publicids.push(public_id)
    }
    const cateObject = await categoryModel.create({
        AddedBy: _id,
        sectionID,
        image: localimages,
        title,
        description,
        customId,
    })
    if (!cateObject) {
        try {
            await cloudinary.api.delete_resorces(publicids)
        } catch (error) {
            console.log(error)
        }
        return next(new Error("fail to add cate,please try again later", { cause: 400 }))
    }
    section.categories.push(cateObject._id)
    await section.save()
    res.status(201).json({
        message: "category added successfully",
        cateObject
    })
}//done
//update cate by Admin
export const updatecate = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findById({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error("not Authrized", { cause: 400 }))
    }
    const { cateID } = req.params
    const category = await categoryModel.findById({ _id: cateID })
    if (!category) {
        return next(new Error("category not found", { cause: 400 }))
    }
    const { title, description, sectionID } = req.query
    if (sectionID && (sectionID !== trip.sectionID)) {
        var section = await sectionModel.findById({ _id: sectionID })
        if (!section) {
            return next(new Error("section not found", { cause: 400 }))
        }
        const oldsection = await sectionModel.findById({ _id: trip.sectionID })
        if (!oldsection) {
            next(new Error("old section not found", { cause: 400 }))
        } else {
            const num1 = oldsection.trips.findIndex((element) => element._id === trip._id)
            oldsection.trips.splice(num1, 1)
            await oldsection.save()
        }
        try {
            for (const image of trip.images) {
                await cloudinary.v2.api.delete_resources(image.public_id)
            }
            await cloudinary.v2.api.delete_folder(`${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips`)
            var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips/${trip.customId}` })
        } catch (error) {
            console.log(error);
        }
        section.trips.push(trip._id)
        await section.save()
        category.sectionID = sectionID
    }
    title ? category.title = title : category.title = category.title
    description ? category.description = description : category.description = category.description
    await category.save()
    res.status(200).json({
        message: "updated",
        category
    })
}
//delete cate by admin
export const deletecate = async (req, res, next) => {
    const { title } = req.body
    const category = await categoryModel.findOne({ title })
    if (!category) {
        return next(new Error("category not found", { cause: 400 }))
    }
    const section = await sectionModel.findById({ _id: category.sectionID })
    if (!section) {
        next(new Error("section not found", { cause: 400 }))
    } else {
        const num1 = section.trips.findIndex(element => element._id === category._id)
        section.trips.splice(num1, 1)
        await section.save()
    }
    for (const image of category.images) {
        try {
            await cloudinary.v2.api.delete_resources(image.public_id)
            await cloudinary.v2.api.delete_folder(`${process.env.project_folder}/sections/${section.customId}/categories`)
        } catch (error) {
            console.log(error);
        }
    }
    const deleteCate = await categoryModel.findOne({ title })
    deleteCate ? res.status(200).json({
        message: "deleted"
    }) : next(new Error("fail to delete trip ,please try again later", { cause: 400 }))
}
// get all cate
export const getAllCates = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size })
    const cates = await categoryModel.find().limit(limit).skip(skip)
    if (!cates) {
        return next(new Error('fail to restore categories , please try again later', { cause: 400 }))
    }
    res.status(200).json({
        message: "done",
        cates
    })
}