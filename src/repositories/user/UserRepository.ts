import mongoose from "mongoose";
import User from "../../persistence/models/User";
import IUserPersisted from "../../persistence/types/IUserPersisted";
import DuplicatedEmailException from "../exceptions/DuplicatedEmailException";
import MissingFieldsException from "../exceptions/MissingFieldsException";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import { ICreateUser } from "./CreateUser.dto";

const userNullHandler = (id: string, user: IUserPersisted | null) => {
  if (user === null) {
    throw new UserNotFoundException(id);
  }
};

const findUserById = async (id: string): Promise<IUserPersisted> => {
  const user = await User.findById(id);
  userNullHandler(id, user);
  return user!;
};

const findUserByEmail = async (email: string): Promise<IUserPersisted> => {
  const user = await User.findOne({ email });
  userNullHandler(email, user);
  return user!;
};

interface IMongoServerError extends Error {
  code: number;
}

const createUser = async (userToCreate: ICreateUser) => {
  const user = new User(userToCreate);
  try {
    return await user.save();
  } catch (error) {
    if (error instanceof Error) {
      let applicationException = error;
      if (
        error.name === "MongoServerError" &&
        (error as IMongoServerError).code === 11000
      ) {
        applicationException = new DuplicatedEmailException();
      }
      if (error.name === "ValidationError") {
        const valError = error as mongoose.Error.ValidationError;
        const invalidFields = Object.keys(valError.errors);
        applicationException = new MissingFieldsException(invalidFields);
      }
      throw applicationException;
    }
    throw error;
  }
};

const getAllUsers = async () => {
  return await User.find({});
};

const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  userNullHandler(id, deletedUser);
};

const UserRepository = {
  createUser,
  findUserById,
  findUserByEmail,
  getAllUsers,
  deleteUser,
};

export default UserRepository;
