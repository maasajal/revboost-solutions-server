import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

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

// Middleware for authenticating JWT tokens
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token;

  try {
    // Check if the token is missing
    if (!token) {
      return res.status(403).json({ message: "Token missing" });
    }

    // Verify the token
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        // Type assertion to JwtPayload
        req.email = (decoded as JwtPayload)?.email; // Set the email to the request
        next(); // Continue to the next middleware
      }
    });
  } catch (error) {
    return res.status(403).json({ message: "Token missing" });
  }
};
