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
  app.get("/v1/users/:id", (req, res) => {
    const id = req.params.id;
    UserRepository.findUserById(id, (error, user) => {
      if (user === null) {
        res.status(404).send("User with the requested id not found.");
      } else {
        res.json(user);
      }
    });
  });

  app.get("/v1/users", (req, res) => {
    UserRepository.getAllUsers((_, users) => {
      res.json(users);
    });
  });

  app.post("/v1/users", (req, res, next) => {
    const userToCreate = req.body as ICreateUser;
    UserRepository.createUser(userToCreate, (error, user) => {
      if (error) {
        if (error instanceof MissingFieldsException) {
          return next(new InvalidInputException(error.message));
        }
        if (error instanceof DuplicatedEmailException) {
          return next(new ConflictException(error.message));
        }
        return next(error);
      }
      res.status(201).json(user);
    });
  });

  app.delete("/v1/users/:id", (req, res, next) => {
    const id = req.params.id;
    UserRepository.deleteUser(id, (error, user) => {
      if (error) {
        if (error instanceof UserNotFoundException) {
          next(new NotFoundException(error.message));
        } else {
          next(error);
        }
      } else {
        res.sendStatus(204);
      }
    });
  });
};

export default UserRoutes;
