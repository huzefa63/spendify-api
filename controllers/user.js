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
  console.log(req.body)
  if (!req.file) return next();

  const fileName = `user-${req.user._id}-${Date.now()}.jpeg`;

  const resizedBuffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    // .jpeg({ quality: 90 })
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
  res.status(200).json({userName:req.user.username,profileImage:req.user.profileImage || '',email:req.user.email});
 
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
    runValidators:true
  });
  res.status(200).json({ status: "success", updatedUser });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const {password,passwordConfirm} = req.body;
  if (!password || !passwordConfirm) return next(new AppError('password is required to update it',400));

  const user = await User.findById(req.user._id);
  if(!user) return next(new AppError('user not found!',400));

  // if(password !== passwordConfirm) return next(new AppError('passwords not equal'));
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.changedPasswordAt = Date.now();
  user.save();
  const jwt = createJwt(user._id,7);
  res.status(200).json({ status: "passwordUpdated",jwt});
});

export const DeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).clearCookie("jwt", "").json({ status: "success" });
});


export const deleteProfileImage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if(!user) return next(new AppError("you don't own this image",400));
  console.log(user)
  const publicId = `${user?.profileImage?.split('upload/')[1]?.split('.')[0]?.split('/')?.slice(1)?.join('/')}.jpeg`;
 
console.log(publicId+'.jpeg');
  const response = await cloudinary.uploader.destroy(publicId,
    { invalidate: true }
  );
  console.log(response)
  if(response.result !== 'ok') return next(new AppError('failed to delete image',400));
    user.profileImage = '';
    await user.save({validateBeforeSave:false});
    return res.status(200).json({ status: "success" });
});
