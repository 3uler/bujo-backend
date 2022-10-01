import { Express } from "express";
import DuplicatedEmailException from "../repositories/exceptions/DuplicatedEmailException";
import MissingFieldsException from "../repositories/exceptions/MissingFieldsException";
import UserNotFoundException from "../repositories/exceptions/UserNotFoundException";
import { ICreateUser } from "../repositories/user/CreateUser.dto";
import UserRepository from "../repositories/user/UserRepository";
import ConflictException from "./exceptions/ConflictException";
import InvalidInputException from "./exceptions/InvalidInputException";
import NotFoundException from "./exceptions/NotFoundException";

const UserRoutes = (app: Express) => {
  app.get("/v1/users/:id", async (req, res, next) => {
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
  });

  app.get("/v1/users", async (req, res, next) => {
    try {
      const users = await UserRepository.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/users", async (req, res, next) => {
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
  });

  app.delete("/v1/users/:id", async (req, res, next) => {
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
  });
};

export default UserRoutes;
