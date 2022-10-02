import { NextFunction, Request, Response, Router } from "express";
import IController from "../../interfaces/IController";
import DuplicatedEmailException from "../../repositories/exceptions/DuplicatedEmailException";
import MissingFieldsException from "../../repositories/exceptions/MissingFieldsException";
import { ICreateUser } from "../../repositories/user/CreateUser.dto";
import AuthenticationService from "../../services/AuthenticationService";
import ConflictException from "../exceptions/ConflictException";
import InvalidInputException from "../exceptions/InvalidInputException";

class AuthenticationController implements IController {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {};

  private registration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: ICreateUser = req.body;
    try {
      const { cookie, user } = await AuthenticationService.register(userData);
      res.setHeader("Set-Cookie", [cookie]).send(user);
    } catch (error) {
      if (error instanceof MissingFieldsException) {
        return next(new InvalidInputException(error.message));
      }
      if (error instanceof DuplicatedEmailException) {
        return next(new ConflictException(error.message));
      }
      return next(error);
    }
  };

  private loggingIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const loginData: = req.body;
  }
}
