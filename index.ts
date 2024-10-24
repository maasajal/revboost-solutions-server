import express, { Express, Request, Response } from "express";
import authRouter from "./routes/authorization/auth.routes";
import authorization from "./routes/authorization/authorization.routes";
import { ConnectDB } from "./routes/db.config";
import expenseAddressRoute from "./routes/expense.address.route";
import expenseRouter from "./routes/expense.route";
import invoiceRouter from "./routes/invoiceRoutes/invoice.routes";
// income
import expensesRoutes from "./routes/expenses/expenseRoutes";
import incomesRoutes from "./routes/incomeRoutes/incomeRoutes";
import incomeRoutes from "./routes/invoiceRoutes/invoice.routes";
import payrollRouter from "./routes/payroll/payroll.routes";
import revenueRouter from "./routes/revenueGrowth/revenue.routes";

import customerMessage from "./routes/customerMessageRoutes/customerMessageRoutes";
import paymentRoutes from "./routes/payment/payment.routes";
import priceRouter from "./routes/pricing/pricing.router";

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
app.use("/api/v1", authorization);
// Features routers | please use this format = app.use("/api/v1", <yourRouter>);

app.use("/api/v1/expenses", expensesRoutes); //need work
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/address", expenseAddressRoute);
// income
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/incomes", incomesRoutes);
// invoice
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1", revenueRouter);
// payroll
app.use("/api/v1/payroll", payrollRouter);

// pricing
app.use("/api/v1/pricing", priceRouter);
// Contact Us form data
app.use("/api/v1", customerMessage)
// app.use("/api/v1/payment", paymentRoutes);
// payment stripe method
app.use("/api/v1/payments", paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the RevBoost Solutions server!" });
});

app.listen(PORT, async () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
});
