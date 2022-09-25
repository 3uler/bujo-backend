import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Enter a first name."],
  },
  lastName: {
    type: String,
    required: [true, "Enter a last name"],
  },
  email: {
    type: String,
    required: [true, "Enter an email address"],
    lowercase: [true],
    unique: [true, "This email address is taken."],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
