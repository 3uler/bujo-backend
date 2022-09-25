import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import errorMiddleware from "./middleware/ErrorMiddleware";
import UserRoutes from "./routes/UserRoutes";

const app = express();

dotenv.config();
const connectionString = process.env.MONGO_URI || "";
mongoose.connect(connectionString, { dbName: process.env.DB_NAME || "bujo" });

app.use(express.json());
UserRoutes(app);

app.use(errorMiddleware);

process.env.MONGO_URI;
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
