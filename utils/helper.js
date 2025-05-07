import jwt from 'jsonwebtoken';

export const createJwt = (id,expiration) => {
  console.log(expiration);
  const tokenExpiration = `${expiration}d`;
  const token = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:tokenExpiration});
  return token;
}

export const createJwtAndSendCookie = (res,cookieName,rememberMe,statusCode,resObject,id) => {
  const token = createJwt(id,rememberMe);

  res.cookie(cookieName,token,{
    expires:new Date(Date.now() + rememberMe * 24 * 60 * 60 * 1000),
    secure:false,
    httpOnly:false,
  }).status(statusCode).json(process.env.ENVIROMENT ==='production' ? resObject:{token});
}