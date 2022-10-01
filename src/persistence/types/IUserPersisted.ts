import { Document, InferSchemaType } from "mongoose";
import { userSchema } from "../models/User";

interface IUserPersisted extends Document, InferSchemaType<typeof userSchema> {}

export default IUserPersisted;
