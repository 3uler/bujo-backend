import { IUser } from "domain/IUser";
import { Express } from "express";

const UserRoutes = (app: Express) => {
  app.get("/v1/users/:id", (req, res) => {
    const id = req.params.id;
    const user: IUser = {
      email: "test@test.com",
      firstName: "My",
      id,
      lastName: "Name",
    };
    res.json(user);
  });
};

export default UserRoutes;
