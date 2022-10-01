import { Router } from "express";
import IController from "../interfaces/IController";

class AuthenticationController implements IController {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {};

  // private registration = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const userData: ICreateUser = req.body;
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   UserRepository.createUser(
  //     { ...userData, password: hashedPassword },
  //     (error, user) => {}
  //   );
  // };
}
