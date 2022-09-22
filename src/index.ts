import express from "express";
import UserRoutes from "./routes/UserRoutes";

const app = express();

UserRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
