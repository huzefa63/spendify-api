function handleValidationError(err,res){
  
  const messagesArr = Object.values(err.errors).map(el => el.message);
  const message = `${messagesArr.join(". ")}`;
  res.status(400).json({
    status:'error',
    statusCode:400,
    errorName:'ValidationError',
    errors:{message}
  })
}

function handleDuplicateKeyError(err,res){

  const fieldName = Object.keys(err.errorResponse.keyValue)[0];
  const message = `${err.errorResponse.keyValue[fieldName]} already exists, use another`;
  

  res.status(400).json({
    status: "error",
    statusCode: 11000,
    errorName: "DuplicateKeyError",
    errors:{message}
  });
}

function handleCastError(err,res){
  const message = `invalid value for ${err.path}: ${err.value}`;

  res.status(400).json({
    status:'error',
    statusCode:400,
    errorType:'CastError',
    errors:{message},
  })
}

export default function globalErrorHandler(err, req, res, next)  {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  console.log(err);
  if(process.env.ENVIROMENT === 'production'){

     if (err.name === "ValidationError") return handleValidationError(err, res);

     if (err.code === 11000) return handleDuplicateKeyError(err, res);

     if(err.name === 'CastError') return handleCastError(err,res);

     if(err.name === 'JsonWebTokenError') return res.status(401).json({status:'fail',message:'you are not logged in, please log in'})

     return res.status(statusCode).json({ status: "error", message:err.message });
  }

  res.status(statusCode).json({err})
  
 
};