import jwt from  "jsonwebtoken";
import util from 'util';

import catchAsync from "../utils/catchAsync.js";
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { createJwt, createJwtAndSendCookie } from "../utils/helper.js";

export const protectRoute = catchAsync(async (req, res, next) => {
    const cookie = req.headers.authorization?.split(" ")[1];

   
    // console.log(req.cookies);
    // check if cookie is there
    if(!cookie) return next(new AppError("you are not logged in, please login", 401));

    // if(!req.body.jwt) return next(new AppError('you are not logged in, please login',401)); // for development
    const decoded = await util.promisify(jwt.verify)(cookie,process.env.JWT_SECRET);

    // check if user exists
    const user = await User.findById(decoded.id);
    if(!user) return next(new AppError('user not found',401));

    // check if user changed password after token was issued
    if(user.changedPasswordAt){
        const passwordChangedAt = parseInt(user.changedPasswordAt.getTime()/1000,10);
        if(passwordChangedAt > decoded.iat) return next(new AppError("you are not logged in, please login", 401));
    }
    req.user = user;
    next();
});

export const handleLoginUser = catchAsync(async (req,res,next) => {
  console.log('from login auth', req.body);
  if(!req?.body?.email || !req?.body?.password) return next(new AppError('email or password is missing',400));
  const {email,password,rememberMe} = req?.body;

  const user = await User.findOne({email}).select('+password');

  // check user password
 
  if(!user ||  !await user.checkPassword(password,user.password)) return next(new AppError('email or password is incorrect',400));
  
  // createJwtAndSendCookie(res,'jwt',rememberMe ? 30 : 7,200,{status:'success'},user._id);
  const token = createJwt(user._id,rememberMe?30:7);
  res.status(200).json({status:'success',token});

})

export const handleLogoutUser = (req,res,next) => {
  if(!req.cookies.jwt) return next(new AppError('you are not logged in',401));
  res
    .clearCookie("jwt", {
      maxAge: rememberMe * 60 * 60 * 1000,
      secure: true,
      path: "/",
      httpOnly: true,
      sameSite: "none",
    })
    .status(200)
    .json({ status: "success" });
}