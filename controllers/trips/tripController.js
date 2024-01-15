import { customAlphabet } from 'nanoid'
import tripModel from "../../model/trip.js"
import cloudinary from "cloudinary"
import categoryModel from "../../model/category.js"
import sectionModel from "../../model/section.js"
import UserModel from "../../model/user.js"
import { paginationFunc } from "../../utilies/pagination.js"
const nanoid = customAlphabet('123456_=!ascbhdtel', 7)
//trip created by admin
export const Addtrip = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findOne({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error('not authrized', { cause: 400 }))
    }
    const { title, sectionID, categoryID, description, price, numberOfNights, startsAt, endsAt } = req.query
    const trip = await tripModel.findOne({ title, sectionID, categoryID })
    if (trip) {
        return next(new Error('title is not allwed to be doubled,please choose another title', { cause: 400 }))
    }
    const category = await categoryModel.findOne({ _id: categoryID })
    if (!category) {
        return next(new Error("category doesn't exsit", { cause: 400 }))
    } const section = await sectionModel.findOne({ _id: sectionID })
    if (!section) {
        return next(new Error("section doesn't exsit", { cause: 400 }))
    }

    /* if (startsAt > endsAt) {
        return next(new Error("the tirp dates are invaild", { cause: 400 }))
    } */
    if (!req.files) {
        return next(new Error("please upload trip's pictures", { cause: 400 }))
    }
    const images = []
    const publicids = []
    const customId = nanoid()
    for (const file of req.files) {
        try {
            var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips/${customId}` })
        } catch (error) {
            console.log(error);
        }
        images.push({ secure_url, public_id })
        publicids.push(public_id)
    }
    const tripObject = await tripModel.create({
        AddedBy: _id,
        images,
        title,
        description,
        customId,
        price,
        sectionID,
        categoryID,
        numberOfNights,
        startsAt,
        endsAt
    })
    if (!tripObject) {
        try {
            await cloudinary.api.delete_resorces(publicids)
        } catch (error) {
            console.log(error)
        }
        return next(new Error("fail to add trip,please try again later", { cause: 400 }))
    }
    category.trips.push(tripObject._id)
    await category.save()
    section.trips.push(tripObject._id)
    await section.save()
    res.status(201).json({
        message: "trip added successfully",
        tripObject
    })
}//done
//update by admin
export const updatetrip = async (req, res, next) => {
    const { _id } = req.authUser
    const user = await UserModel.findById({ _id })
    if (!user || user.isAdmin == false) {
        return next(new Error("not Authrized", { cause: 400 }))
    }
    const { tripID } = req.params
    const trip = await tripModel.findById({ _id: tripID })
    if (!trip) {
        return next(new Error("trip not found", { cause: 400 }))
    }
    const { title, sectionID, categoryID, description, price, numberOfNights, startsAt, endsAt } = req.query
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
        trip.sectionID = sectionID
    }
    if (categoryID && (categoryID !== trip.sectionID)) {
        var category = await categoryModel.findById({ _id: categoryID })
        if (!category) {
            return next(new Error("category not found", { cause: 400 }))
        }
        const oldcategory = await sectionModel.findById({ _id: trip.sectionID })
        if (!oldcategory) {
            next(new Error("old cateory not found", { cause: 400 }))
        } else {
            const num1 = oldcategory.trips.findIndex((element) => element._id === trip._id)
            oldcategory.trips.splice(num1, 1)
            await oldcategory.save()
        }
        category.trips.push(trip._id)
        await category.save()
        trip.categoryID = categoryID
    }
    title ? trip.title = title : trip.title = trip.title
    description ? trip.description = description : trip.description = trip.description
    price ? trip.price = price : trip.price = trip.price
    numberOfNights ? trip.numberOfNights = numberOfNights : trip.numberOfNights = trip.numberOfNights
    startsAt ? trip.startsAt = startsAt : trip.startsAt = trip.startsAt
    endsAt ? trip.endsAt = endsAt : trip.endsAt = trip.endsAt
    if (req.files) {
        const images = [...trip.images]
        for (const file of req.files) {
            try {
                var { secure_url, public_id } = await cloudinary.v2.uploader.upload(file.path, { folder: `${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips/${trip.customId}` })
            } catch (error) {
                console.log(error);
            }
            images.push({ secure_url, public_id })
        }
        trip.images = images
    }
    await trip.save()
    res.status(200).json({
        message: "updated",
        trip
    })
}
//delete by admin
export const deletetrip = async (req, res, next) => {
    const { title } = req.body
    const trip = await tripModel.findOne({ title })
    if (!trip) {
        return next(new Error("trip does not exsit", { cause: 400 }))
    }
    const section = await sectionModel.findById(trip.sectionID)
    if (!section) {
        next(new Error("section not found", { cause: 400 }))
    } else {
        const num1 = section.trips.findIndex((element) => element._id === trip._id)
        section.trips.splice(num1, 1)
        await section.save()
    }
    const category = await categoryModel.findById(trip.categoryID)
    if (!category) {
        next(new Error("category not found", { cause: 400 }))
    } else {
        const num = category.trips.findIndex((element) => element._id === trip._id)
        section.trips.splice(num, 1)
        await category.save()
    }
    for (const image of trip.images) {
        try {
            await cloudinary.v2.api.delete_resources(image.public_id)
            await cloudinary.v2.api.delete_folder(`${process.env.project_folder}/sections/${section.customId}/categories/${category.customId}/trips`)
        } catch (error) {
            console.log(error);
        }
    }
    const deletetrip = await tripModel.findOneAndDelete({ title })
    deletetrip ? res.status(200).json({
        message: "deleted"
    }) : next(new Error("fail to delete trip ,please try again later", { cause: 400 }))
}//done
export const getAlltrips = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size })
    const trips = await tripModel.find().limit(limit).skip(skip).populate("reviews")
    if (!trips) {
        return next(new Error('fail to restore trips , please try again later', { cause: 400 }))
    }
    res.status(200).json({
        message: "done",
        trips
    })
}