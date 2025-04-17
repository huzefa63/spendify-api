export default function globalErrorHandler(err, req, res, next)  {
  console.log(err.keyValue);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `The ${field} "${value}" is already in use.`;
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};