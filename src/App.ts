import cookieParser from "cookie-parser";
import express, { Application } from "express";
import mongoose from "mongoose";
import IController from "./interfaces/IController";
import errorMiddleware from "./middleware/ErrorMiddleware";

class App {
  private app: Application;

  constructor(controllers: IController[]) {
    this.app = express();

    this.connectToDatabase();
    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  private connectToDatabase() {
    const connectionString = process.env.MONGO_URI || "";
    mongoose.connect(connectionString, {
      dbName: process.env.DB_NAME || "bujo",
    });
  }

  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => console.log(`App listening on port ${port}`));
  }
}

export default App;
