import reviewModel from "../../model/review.js";
import tripModel from "../../model/trip.js"
import UserModel from "../../model/user.js";

export const Addreview = async (req, res, next) => {
    const { _id } = req.authUser
    const { reviewContent, rate } = req.body
    const { tripID } = req.params
    const user = await UserModel.findOne({ _id })
    if (!user || user.isAdmin === true) {
        return next(new Error("not authrized", { cause: 400 }))
    }
    const tripFound = await tripModel.findOne({ _id: tripID })
    if (!tripFound) {
        return next(new Error("trip not found", { cause: 400 }))
    }
    const reviewFound = await reviewModel.findOne({ AddedBy: _id, trip: tripID })
    if (reviewFound) {
        return next(new Error("you have reviewed this trip before ,thanks for sharing you thoughts", { cause: 400 }))
    }
    const reviewObject = await reviewModel.create({
        reviewContent,
        rate,
        AddedBy: _id,
        trip: tripFound._id
    })
    const reviewsRates = await reviewModel.find({ trip: tripID }).select("rate")
    const Arr = []
    for (const ratevalue of reviewsRates) {
        Arr.push(ratevalue.rate)
    }
    const AveRate = (Arr.reduce((sum, AVE) => sum + AVE, 0) / Arr.length).toFixed(2)
    tripFound.reviews.push({ reviewID: reviewObject._id, reviewAddedby: _id })
    tripFound.rate = AveRate
    await tripFound.save()
    res.status(200).json({
        message: "review added",
        reviewObject
    })
}
export const deletereview = async (req, res, next) => {
    const { _id } = req.authUser
    const { tripID } = req.params
    const user = await UserModel.findOne({ _id })
    if (!user) {
        return next(new Error("not authrized", { cause: 400 }))
    }
    const reviewFound = await reviewModel.findOne({ AddedBy: _id, trip: tripID })
    if (!reviewFound) {
        return next(new Error("review not found", { cause: 400 }))
    }
    const trip = await tripModel.findOne({ _id: tripID })
    if (!trip) {
        return next(new Error("trip not found", { cause: 400 }))
    }

    for (const review of trip.reviews) {
        var num = trip.reviews.findIndex(obj => {
            review.reviewAddedby === reviewFound.AddedBy
            return obj.reviewAddedby === _id
        })
    }
    const reviewsRates = await reviewModel.find({ trip: tripID }).select("rate")
    const Arr = []
    for (const ratevalue of reviewsRates) {
        Arr.push(ratevalue.rate)
    }
    const AveRate = (Arr.reduce((sum, AVE) => sum + AVE, 0) / Arr.length).toFixed(2)
    trip.rate = AveRate
    trip.reviews.splice(num, 1)
    await trip.save()
    const deletedreview = await reviewModel.findOneAndDelete({ AddedBy: _id, trip: tripID })
    if (!deletedreview) {
        return next(new Error("fail to delete review ,please try again later", { cause: 400 }))
    }
    res.status(200).json({
        message: "deleted",
    })
}
export const updateReview = async (req, res, next) => {
    const { _id } = req.authUser
    const { tripID } = req.params
    const { reviewContent, rate } = req.body
    const user = await UserModel.findOne({ _id })
    if (!user || user.isAdmin === false) {
        return next(new Error("not authrized", { cause: 400 }))
    }
    const reviewFound = await reviewModel.findOne({ AddedBy: _id, trip: tripID })
    if (!reviewFound) {
        return next(new Error("review not found", { cause: 400 }))
    }
    const trip = await tripModel.findOne({ _id: tripID })
    if (!trip) {
        return next(new Error("trip not found", { cause: 400 }))
    }
    reviewContent ? reviewFound.reviewContent = reviewContent : reviewFound.reviewContent = reviewFound.reviewContent
    rate ? reviewFound.rate = rate : reviewFound.rate = reviewFound.rate
    await reviewFound.save()
    const reviewsRates = await reviewModel.find({ trip: tripID }).select("rate")
    const Arr = []
    for (const ratevalue of reviewsRates) {
        Arr.push(ratevalue.rate)
    }
    const AveRate = (Arr.reduce((sum, AVE) => sum + AVE, 0) / Arr.length).toFixed(2)
    trip.rate = AveRate
    await trip.save()
    res.status(200).json({
        message: "updated",
        reviewFound
    })
}
