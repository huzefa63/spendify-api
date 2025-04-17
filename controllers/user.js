import catchAsync from '../utils/catchAsync.js';
import User from '../models/user.js';

export const createUser = catchAsync(async (req, res, next) => {
  
  const user = await User.create(req.body);
  res.status(201).json({ user });

});