import catchAsync from "../utils/catchAsync.js";
import Category from "../models/categories.js";

export const handleGetCategories = catchAsync(async (req, res, next) => {
  
  const category = await Category.find({user: req.user._id });
  res.status(201).json({ status: "success",categories:category });
});

export const handleCreateCategory = catchAsync(async (req,res,next) =>{
    const { categoryName } = req.body;
    const category = await Category.findOne({categoryName,user:req.user._id});
    console.log(category);
    if(category) return res.status(400).json({status:'exists'});
    await Category.create({categoryName,user:req.user._id});
    res.status(201).json({status:'success'});
})
export const handleDeleteCategory = catchAsync(async (req,res,next) => {
    const { categoryId } = req.body;
    if(!categoryId) return;
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ status: "success" });
})
