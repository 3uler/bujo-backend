import IUserPersisted from "../persistence/types/IUserPersisted";
import IUser from "./IUser";

const toDomainModel = (userPersisted: IUserPersisted): IUser => {
  return {
    _id: userPersisted._id.toString(),
    email: userPersisted.email,
    firstName: userPersisted.firstName,
    lastName: userPersisted.lastName,
  };
};

const UserMapper = {
  toDomainModel,
};

export default UserMapper;
