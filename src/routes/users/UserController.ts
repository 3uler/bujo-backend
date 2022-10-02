import { NextFunction, Request, Response, Router } from "express";
import IController from "../../interfaces/IController";
import DuplicatedEmailException from "../../repositories/exceptions/DuplicatedEmailException";
import MissingFieldsException from "../../repositories/exceptions/MissingFieldsException";
import UserNotFoundException from "../../repositories/exceptions/UserNotFoundException";
import { ICreateUser } from "../../repositories/user/CreateUser.dto";
import UserRepository from "../../repositories/user/UserRepository";
import ConflictException from "../exceptions/ConflictException";
import InvalidInputException from "../exceptions/InvalidInputException";
import NotFoundException from "../exceptions/NotFoundException";

class UserController implements IController {
  public path = "/v1/users";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(`${this.path}/:id`, this.getUser);
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  };

  private getUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const user = await UserRepository.findUserById(id);
      res.json(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        next(new NotFoundException(error.message));
      } else {
        next(error);
      }
    }
  };

  private getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await UserRepository.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userToCreate = req.body as ICreateUser;
    try {
      const createdUser = await UserRepository.createUser(userToCreate);
      res.status(201).json(createdUser);
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

  private deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      await UserRepository.deleteUser(id);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        next(new NotFoundException(error.message));
      } else {
        next(error);
      }
    }
  };
}

export default UserController;
