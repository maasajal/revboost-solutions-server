import express, { Express, Request, Response } from "express";
import authenticationRoute from "./routes/authentication.routes";
import authRouter from "./routes/authorization/auth.routes";
import { ConnectDB } from "./routes/db.config";
import expenseAddressRoute from "./routes/expense.address.route";
import expenseRouter from "./routes/expense.route";
import invoiceRouter from "./routes/invoiceRoutes/invoice.routes";
import revenueRouter from "./routes/revenueGrowth/revenue.routes";
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

// Authentication routers
app.use("/api/v1", authRouter);
app.use("/api/v1/login", authenticationRoute);
// Features routers | please use this format = app.use("/api/v1", <yourRouter>);

app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/address", expenseAddressRoute);
// invoice
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1", revenueRouter);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
});
