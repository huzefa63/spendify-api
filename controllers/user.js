import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import { createJwt, createJwtAndSendCookie } from "../utils/helper.js";
import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream";

const multerStorage = memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    cb(new AppError("file is not an image", 400), false);
  cb(null, true);
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const fileName = `user-${req.user._id}-${Date.now()}.jpeg`;

  const resizedBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const readableBuffer = new Readable();
  readableBuffer.push(resizedBuffer);
  readableBuffer.push(null);

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "spendify-user-profile-image",
      resource_type:'image',
      public_id:fileName,
    },
    (err, res) => {
      if (err) {
        next(new AppError("failed uploading image", 400));
      } else {
        req.body.image_url = res.secure_url;
        next();
      }
    }
  );
  readableBuffer.pipe(stream);

});

export const getUser = catchAsync(async (req, res, next) => {
console.log('hello there')
  res.status(200).json({userName:req.user.userName,profileImage:req.user.profileImage || ''})
 
});

export const CreateUser = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const { rememberMe } = req.body;
  delete req.body.role;
  const user = await User.create(req.body);
  // createJwtAndSendCookie(res, "jwt", rememberMe ? 30:7, 201, { user,status:'success' }, user._id);
  const token = createJwt(user._id,rememberMe?30:7);
    res.status(200).json({status:'success',token});
});

export const UpdateUser = catchAsync(async (req, res, next) => {
  const {password, email, passwordConfirm, role, ...filteredBody} = req.body;
  
  if (req.file) filteredBody.profileImage = req.body.image_url;
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", updatedUser });
});

export const DeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).clearCookie("jwt", "").json({ status: "success" });
});



