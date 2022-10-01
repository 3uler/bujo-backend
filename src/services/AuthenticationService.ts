import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ITokenData from "../interfaces/ITokenData";
import ITokenPayload from "../interfaces/ITokenPayload";
import IUserPersisted from "../persistence/types/IUserPersisted";
import { ICreateUser } from "../repositories/user/CreateUser.dto";
import UserRepository from "../repositories/user/UserRepository";

const register = async (userData: ICreateUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await UserRepository.createUser({
    ...userData,
    password: hashedPassword,
  });
  const tokenData = createToken(user);
  const cookie = createCookie(tokenData);
  return { cookie, user };
};

const createToken = (user: IUserPersisted): ITokenData => {
  const expiresIn = 60 * 60;
  const secret = process.env.JWT_SECRET;
  if (secret === undefined) {
    throw new Error("jwt secret not set.");
  }
  const dataStoredInToken: ITokenPayload = {
    _id: user._id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
};

const createCookie = (tokenData: ITokenData) => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

const AuthenticationService = {
  register,
};

export default AuthenticationService;
