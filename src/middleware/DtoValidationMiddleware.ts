import { NextFunction, Request, Response } from "express";
import InvalidInputException from "../routes/exceptions/InvalidInputException";

const dtoValidationMiddleware = <T>(typeGuard: (v: any) => v is T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (typeGuard(req.body)) {
      return next();
    }
    return next(new InvalidInputException("Invalid input"));
  };
};

export default dtoValidationMiddleware;
