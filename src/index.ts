import express from "express";
import UserController from "./controller/UserController";

const app = express();

UserController(app);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
