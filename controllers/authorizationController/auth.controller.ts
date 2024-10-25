import { Request, Response } from "express";
import mongoose from "mongoose";
import { generateToken } from "../../jwt/jwt";
import { UserModel } from "../../models/auth.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const { email } = userData;
    const userExists = await UserModel.findOne({ email });
    const token = generateToken(email);

    if (userExists) {
      return res.status(200).send({
        message: token,
        subscriptionStatus: userExists.subscriptionStatus,
      });
    }
    const addUser = await UserModel.create(userData);
    if (addUser) {
      res.status(200).send({
        message: token,
      });
    } else {
      res.status(400).send({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const email = req.query.email;
  const tab = req.query.tab as string | string[] | undefined;

  try {
    const allUsers = await UserModel.find();
    let filteredUsers = allUsers;

    if (email) {
      filteredUsers = await UserModel.find({ email });
    } else if (tab && tab !== "all") {
      filteredUsers = await UserModel.find({ role: tab });
    }

    res.send(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user) {
      res.status(200).send({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(404).send({ Error: "Users not found!" });
  }
};

export const updateUserByEmail = async (req: Request, res: Response) => {
  try { 
    const email = req.params.email; 

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const updatedFields = req.body; 
    Object.assign(user, updatedFields);
    await user.save();

    if (user) {
      res.status(200).send({ message: `${email} User's data updated` });
    }
  } catch (error) {
    console.error(error);
    res.status(404).send({ Error: "Users not found!" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res
      .status(200)
      .send({ message: `User with ID ${id} was successfully deleted` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


export const updateUserSubscriptionStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.body.userId; // Assuming userId is passed in the request body
    const newSubscriptionStatus = req.body.updateStatus;   
    // Find the user by ID
    const user = await UserModel.findById(userId); 
    // Log the fetched user for debugging  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }  
    // Update subscription status
    user.subscriptionStatus = newSubscriptionStatus;  
    console.log("Updated Subscription Status:", user.subscriptionStatus);   
    // Save the updated document
    const updatedUser = await user.save(); // Use await to wait for the save operation  
    return res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error("Error updating user subscription status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}