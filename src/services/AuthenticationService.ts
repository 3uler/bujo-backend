import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import UserMapper from "../domain/UserMapper";
import ITokenData from "../interfaces/ITokenData";
import ITokenPayload from "../interfaces/ITokenPayload";
import IUserPersisted from "../persistence/types/IUserPersisted";
import { ICreateUser } from "../repositories/user/CreateUser.dto";
import UserRepository from "../repositories/user/UserRepository";
import ILogin from "../routes/auth/ILogin";
import WrongCredentialsException from "./exceptions/WrongCredentialsException";

const register = async (userData: ICreateUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await UserRepository.createUser({
    ...userData,
    password: hashedPassword,
  });
  const tokenData = createToken(user);
  const cookie = createCookie(tokenData);
  return { cookie, user: UserMapper.toDomainModel(user) };
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

const authenticate = async (loginData: ILogin) => {
  try {
    const user = await UserRepository.findUserByEmail(loginData.email);
    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (isPasswordMatching) {
      const tokenData = createToken(user);
      const cookie = createCookie(tokenData);
      return { cookie, user: UserMapper.toDomainModel(user) };
    } else {
      throw new WrongCredentialsException();
    }
  } catch (error) {
    throw new WrongCredentialsException();
  }
};

const AuthenticationService = {
  authenticate,
  register,
};

export default AuthenticationService;
