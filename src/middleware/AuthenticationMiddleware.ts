import { NextFunction, Response } from "express";
import IRequestWithUser from "../interfaces/IRequestWithUser";
import MissingAuthTokenException from "../routes/exceptions/MissingAuthTokenException";
import WrongAuthTokenException from "../routes/exceptions/WrongAuthTokenException";
import AuthenticationService from "../services/AuthenticationService";

const authenticationMiddleware = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (bearer) {
    try {
      const user = await AuthenticationService.validate(bearer);
      req.user = user;
      return next();
    } catch (error) {
      return next(new WrongAuthTokenException());
    }
  }
  return next(new MissingAuthTokenException());
};

export default authenticationMiddleware;
