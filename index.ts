import express, { Express, Request, Response } from "express";
import authenticationRouter from "./routes/authentication.routes";
import expenseRouter from "./routes/expense.route";
import expenseAddressRoute from "./routes/expense.address.route";
import authorization from "./routes/authorization/authorization";
import users from "./routes/users/users.routes";
import { ConnectDB } from "./routes/db.config";
import invoiceRouter from "./routes/invoiceRoutes/invoice.routes";
const cors = require("cors");

const app: Express = express();
const PORT: number = 3000;

ConnectDB();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://revboost.business-easy.com",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", authenticationRouter);
app.use("/authorize", authorization);
app.use("/api/v1", users);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/address", expenseAddressRoute);
// invoice
app.use("/api/v1/invoices", invoiceRouter);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
});
