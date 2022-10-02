import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import UserMapper from "../domain/UserMapper";
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
  const token = createToken(user);
  return { token, user: UserMapper.toDomainModel(user) };
};

const createToken = (user: IUserPersisted): string => {
  const expiresIn = 60 * 60;
  const secret = getJWTSecret();
  const dataStoredInToken: ITokenPayload = {
    _id: user._id,
  };
  return jwt.sign(dataStoredInToken, secret, { expiresIn });
};

const authenticate = async (loginData: ILogin) => {
  try {
    const user = await UserRepository.findUserByEmail(loginData.email);
    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (isPasswordMatching) {
      const token = createToken(user);
      return { token, user: UserMapper.toDomainModel(user) };
    } else {
      throw new WrongCredentialsException();
    }
  } catch (error) {
    throw new WrongCredentialsException();
  }
};

const validate = async (bearerToken: string) => {
  const secret = getJWTSecret();
  const token = stripBearer(bearerToken);
  const payload = jwt.verify(token, secret) as ITokenPayload;

  const user = await UserRepository.findUserById(payload._id);

  return UserMapper.toDomainModel(user);
};

const stripBearer = (bearer: string) => {
  const regex = /^Bearer (.*)/;
  const match = bearer.match(regex);
  if (match === null) {
    throw new Error("Wrong bearer token");
  }
  return match[1];
};

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret === undefined) {
    throw new Error("jwt secret not set.");
  }
  return secret;
};

const AuthenticationService = {
  authenticate,
  register,
  validate,
};

export default AuthenticationService;
