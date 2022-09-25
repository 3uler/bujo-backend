import mongoose, { CallbackError } from "mongoose";
import User from "../../persistence/models/User";
import DuplicatedEmailException from "../exceptions/DuplicatedEmailException";
import MissingFieldsException from "../exceptions/MissingFieldsException";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import { ICreateUser } from "./CreateUser.dto";

type DoneCallback = (error: Error | null, data: any) => void;

const userPotentiallyNullHandler =
  <T>(id: string, done: DoneCallback) =>
  (error: CallbackError, data: T) => {
    if (error) {
      return done(error, null);
    }
    if (data === null) {
      return done(new UserNotFoundException(id), null);
    }
    done(null, data);
  };

const findUserById = (id: string, done: DoneCallback) => {
  User.findById(id, {}, userPotentiallyNullHandler(id, done));
};

interface IMongoServerError extends Error {
  code: number;
}

const createUser = (userToCreate: ICreateUser, done: DoneCallback) => {
  const user = new User(userToCreate);
  user.save((error, user) => {
    if (error) {
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
      return done(applicationException, null);
    }
    done(null, user);
  });
};

const getAllUsers = (done: DoneCallback) => {
  User.find({}, done);
};

const deleteUser = (id: string, done: DoneCallback) => {
  User.findByIdAndDelete(id, {}, userPotentiallyNullHandler(id, done));
};

const UserRepository = {
  createUser,
  findUserById,
  getAllUsers,
  deleteUser,
};

export default UserRepository;
