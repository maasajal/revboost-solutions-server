import express, { Express, Request, Response } from "express";
import authenticationRouter from "./routes/authentication.routes";
import { ConnectDB } from "./routes/db.config";

const app: Express = express();

const PORT: number = 3000;

app.use(express.json());

app.use("/api/v1", authenticationRouter); // এই লাইন মুলত আমাদের authentication  API গুলাকে হিট করবে

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
  await ConnectDB();
});
