import express, { Express, Request, Response } from "express";
import authenticationRouter from "./routes/authentication.routes";
import authorization from "./routes/authorization/authorization";
import { ConnectDB } from "./routes/db.config";
const cors = require('cors');

const app: Express = express();
const PORT: number = 3000;

ConnectDB();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174","https://revboost.business-easy.com"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", authenticationRouter); // এই লাইন মুলত আমাদের authentication  API গুলাকে হিট করবে
app.use("/authorize", authorization) // এই রাউট অথরাইজেশন এর জন্যে কাজ করবে এবং সে authorization.ts রাউটে যাবে

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
   
});
