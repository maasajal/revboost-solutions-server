import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/auth.model"; // Import the user model (adjust the path accordingly)

export const AdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!); // Replace with your JWT secret

    // Find the user by the decoded ID from the token payload
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the user's role is admin
    if (user.role !== "admin") {
      return res.status(403).send({ message: "Access denied. Admins only." });
    }

    // If everything is fine, log the middleware message and proceed to the next middleware/controller
    console.log("Admin middleware passed");
    next();
  } catch (error) {
    console.error("Error in isAdminMiddleware:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
