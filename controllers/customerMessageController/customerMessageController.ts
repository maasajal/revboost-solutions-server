import { Request, Response } from "express";
import UserMessages from "../../models/customerMessage/customerMessage";

// Get all contacts
export const getAllMessage = async (req: Request, res: Response) => {
  try {
    const findAllMessage = await UserMessages.find();
    res.status(200).send(findAllMessage);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Server error" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { companyName, name, email, phone, details } = req.body;
    const newMessage = {
      companyName,
      name,
      phone,
      details,
      readStatus: "unread",
    };
    const updatedUser = await UserMessages.findOneAndUpdate(
      { email }, // Find by email
      { $push: { messages: newMessage } }, // Push the new message into messages array
      { new: true, upsert: true } // Create a new document if the user doesn't exist
    );

    res.status(201).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : "Server error" });
  }
};
