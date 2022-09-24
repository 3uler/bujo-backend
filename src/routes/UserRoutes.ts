import { Express } from "express";
import UserNotFoundException from "../repositories/exceptions/UserNotFoundException";
import UserRepository from "../repositories/UserRepository";
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

  app.post("/v1/users", (req, res) => {
    UserRepository.createUser((error, user) => {
      res.json(user);
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
