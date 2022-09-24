import { NextFunction, Request, Response } from "express";
import HttpException from "../routes/exceptions/HttpException";
import LoggingService from "../services/Loggingservice";

const errorMiddleware = (
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err instanceof HttpException ? err.status : 500;
  const message =
    err instanceof HttpException ? err.message : "Internal server error";
  if (!(err instanceof HttpException)) {
    LoggingService.logError(err);
  }
  res.status(status).send(message);
};

export default errorMiddleware;
