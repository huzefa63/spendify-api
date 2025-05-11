import catchAsync from "../utils/catchAsync.js";
import Transaction from "../models/transaction.js";
import AppError from "../utils/appError.js";
export const createTransaction = catchAsync(async (req, res, next) => {
  const transaction = { ...req.body, user: req.user._id };
  await Transaction.create(transaction);
  res.status(201).json({ status: "success" });
});

export const updateTransaction = catchAsync(async (req, res, next) => {
  const { createdAt, ...expenseObj } = req.body;
  const { id } = req.params;
  if (!id)
    return next(new AppError("expense id is required to update it", 400));

  // check if this expense is current user's expense
  const expense = await Transaction.findById(id);
  if (expense.user.toString() !== req.user._id.toString())
    return next(
      new AppError(
        "you do not have permission to update this expense details",
        401
      )
    );
  await Transaction.findByIdAndUpdate(id, expenseObj, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ status: "success" });
});

// export const deleteExpense = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   if (!id)
//     return next(new AppError("expense id is required to delete it", 400));

//   // check if this expense belongs to current user

//   const expense = await Transaction.findById(id);
//   if (expense.user !== req.user._id)
//     return next(
//       new AppError(
//         "you do not have permission to update this expense details",
//         401
//       )
//     );
//   await Transaction.findByIdAndDelete(id);
//   res.status(200).json({ status: "success" });
// });

export const getTransaction = catchAsync(async (req, res, next) => {
  const { page, from, to, category, amount, transactionType, filter } =
    req.query;
  console.log(filter);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  console.log("transaction");
  let filterObj = {};
  filterObj.user = req.user._id;
  if (from && !to) {
    const date = new Date(from);
    filterObj.date = { $gte: date };
  }
  if (!from && to) {
    const date = new Date(to);
    filterObj.date = { $lte: date };
  }
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    // Set the time of the fromDate to the start of the day (00:00:00)
    fromDate.setHours(0, 0, 0, 0);

    // Set the time of the toDate to the end of the day (23:59:59)
    toDate.setHours(23, 59, 59, 999);
    filterObj.date = { $gte: fromDate, $lte: toDate };
  }

  if (category) filterObj.category = category;
  if (transactionType) filterObj.transactionType = transactionType;

  const totalDoc = await Transaction.countDocuments(filterObj);
  let transaction;
  let sortSequence = -1;
  if (filter === "oldest") sortSequence = 1;

  if (!amount)
    transaction = await Transaction.find(filterObj)
      .sort({ createdAt: sortSequence })
      .skip(skip)
      .limit(pageSize);

  if (amount) {
    const sortAmount = amount === "low-to-high" ? 1 : -1;
    transaction = await Transaction.find(filterObj)
      .sort({ amount: sortAmount, createdAt: sortSequence })
      .skip(skip)
      .limit(pageSize);
  }

  res
    .status(200)
    .json({ totalPages: Math.ceil(totalDoc / pageSize), transaction });
});

export const deleteTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(new AppError("expense id is required to delete it", 400));

  // check if this expense belongs to current user

  const transaction = await Transaction.findById(id);
  if (transaction.user.toString() !== req.user._id.toString())
    return next(
      new AppError(
        "you do not have permission to update this expense details",
        401
      )
    );
  await Transaction.findByIdAndDelete(id);
  res.status(200).json({ status: "success" });
});