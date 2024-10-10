import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { UserModel } from "../models/auth.model";

// Extend the Express Request interface to include the email property
declare global {
  namespace Express {
    interface Request {
      email?: string; // Optional property for email
    }
  }
}

// Define the JWT payload interface
interface JwtPayload {
  email: string;
  // Add other properties that may be included in the token
}

interface Authorization {
  authorization: string | undefined;
}
// Middleware for authenticating JWT tokens
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  const token = authorization?.split(" ")[1];
  try {
    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify the token
    jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
      (err: VerifyErrors | null, decoded: unknown) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        } else {
          // Type assertion to JwtPayload
          req.email = (decoded as JwtPayload)?.email; // Set the email to the request
          next(); // Continue to the next middleware
        }
      }
    );
  } catch (error) {
    return res.status(403).json({ message: "Token missing" });
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req?.email;
  console.log("email:", email);
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(403).send({ message: "messing" });
  } else if (user.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "you are not admin" });
  }
};

export const basicPlanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req?.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(403).send({ message: "messing" });
  } else if (
    user.role === "admin" ||
    (user.role === "member" && user.subscriptionPlan === "basic")
  ) {
    next();
  } else {
    res.status(403).send({ message: "you are not admin" });
  }
};

export const standardPlanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req?.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(403).send({ message: "messing" });
  } else if (
    user.role === "admin" ||
    (user.role === "member" && user.subscriptionPlan === "standard")
  ) {
    next();
  } else {
    res.status(403).send({ message: "you are not admin" });
  }
};

export const premiumPlanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req?.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(403).send({ message: "messing" });
  } else if (
    user.role === "admin" ||
    (user.role === "member" && user.subscriptionPlan === "premium")
  ) {
    next();
  } else {
    res.status(403).send({ message: "you are not admin" });
  }
};
