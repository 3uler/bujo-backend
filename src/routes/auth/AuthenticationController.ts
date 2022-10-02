import { NextFunction, Request, Response, Router } from "express";
import IController from "../../interfaces/IController";
import dtoValidationMiddleware from "../../middleware/DtoValidationMiddleware";
import DuplicatedEmailException from "../../repositories/exceptions/DuplicatedEmailException";
import MissingFieldsException from "../../repositories/exceptions/MissingFieldsException";
import { ICreateUser } from "../../repositories/user/CreateUser.dto";
import AuthenticationService from "../../services/AuthenticationService";
import WrongCredentialsException from "../../services/exceptions/WrongCredentialsException";
import ConflictException from "../exceptions/ConflictException";
import InvalidInputException from "../exceptions/InvalidInputException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ILogin, { isLoginDto } from "./ILogin";

class AuthenticationController implements IController {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(`${this.path}/register`, this.registration);
    this.router.post(
      `${this.path}/login`,
      dtoValidationMiddleware(isLoginDto),
      this.loggingIn
    );
  };

  private registration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: ICreateUser = req.body;
    try {
      const tokenAndUser = await AuthenticationService.register(userData);
      res.status(201).send(tokenAndUser);
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
    const loginData: ILogin = req.body;
    try {
      const tokenAndUser = await AuthenticationService.authenticate(loginData);
      res.send(tokenAndUser);
    } catch (error) {
      if (error instanceof WrongCredentialsException) {
        return next(new UnauthorizedException(error.message));
      }
      return next(error);
    }
  };
}

export default AuthenticationController;
