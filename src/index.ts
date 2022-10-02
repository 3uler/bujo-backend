import dotenv from "dotenv";
import App from "./App";
import AuthenticationController from "./routes/auth/AuthenticationController";
import UserController from "./routes/users/UserController";

dotenv.config();

const app = new App([new AuthenticationController(), new UserController()]);

app.listen();
