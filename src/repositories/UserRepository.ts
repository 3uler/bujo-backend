import User from "../persistence/models/User";
import UserNotFoundException from "./exceptions/UserNotFoundException";

type DoneCallback = (error: Error | null, data: any) => void;

const errorLogging = (done: DoneCallback) => (error: any, data: any) => {
  if (error) {
    console.log(error);
  }
  done(null, data);
};

const findUserById = (id: string, done: DoneCallback) => {
  User.findById(id, errorLogging(done));
};

const createUser = (done: DoneCallback) => {
  const user = new User({
    firstName: "Paul",
    lastName: "Mueller",
    email: `p${Math.floor(1000 * Math.random())}@m.com`,
  });
  user.save(errorLogging(done));
};

const getAllUsers = (done: DoneCallback) => {
  User.find({}, errorLogging(done));
};

const deleteUser = (id: string, done: DoneCallback) => {
  User.findByIdAndDelete(id, {}, (error, data) => {
    if (error) {
      console.log(error);
    }
    if (data === null) {
      const userNotFoundException = new UserNotFoundException(id);
      return done(userNotFoundException, null);
    }
    done(null, data);
  });
};

const UserRepository = {
  createUser,
  findUserById,
  getAllUsers,
  deleteUser,
};

export default UserRepository;
