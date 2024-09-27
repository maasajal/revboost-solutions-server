import express, { Express, Request, Response } from "express";
import { ConnectDB } from "./mongodb/db.config";
import addressRoute from "./routes/expense.route"

const app: Express = express();
const PORT: number = 3000;

ConnectDB();

app.use(express.json());

app.use("api/v1/expense",addressRoute)

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
   
});
