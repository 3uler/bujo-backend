import { Request } from "express";
import IUser from "../domain/IUser";

interface IRequestWithUser extends Request {
  user?: IUser;
}

export default IRequestWithUser;
