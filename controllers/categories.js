import catchAsync from "../utils/catchAsync.js";
import Category from "../models/categories.js";

export const handleCreateCategory = catchAsync(async (req,res,next) =>{
    const { category } = req.body;
    await Category.create({name:category,user:req.user._id});
    res.status(201).json({status:'success'});
})
export const handleDeleteCategory = catchAsync(async (req,res,next) => {
    const { category } = req.body;
    await Category.findByIdAndDelete(req.body.category);
    res.status(200).json({ status: "success" });
})
