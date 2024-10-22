import { Request, Response } from "express";
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose'; // Import Document from mongoose
import UserMessages from "../../models/customerMessage/customerMessage";

interface IMessage {
    _id: ObjectId; 
    companyName: string;
    name: string;
    phone: string;
    details: string;
    readStatus: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserMessages extends Document {
    email: string;
    __v: number;
    createdAt: Date;
    messages: IMessage[]; 
    updatedAt: Date;
}

// Get all contacts
export const updateReadStatus = async (req: Request, res: Response) => {
    const personId = req.query.main as string; 
    const messageId = req.query.message as string; 
    try {
        const user = await UserMessages.findById(personId) as IUserMessages;

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const message = user.messages.find(msg => msg._id.toString() === messageId);

        if (!message) {
            return res.status(404).send({ error: "Message not found" });
        }
        message.readStatus = 'read'; 
        await user.save(); 

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: error instanceof Error ? error.message : "Server error" });
    }
};



export const getAllMessage = async (req: Request, res: Response) => {
    try {
      const findAllMessage = await UserMessages.find();
      console.log(findAllMessage);
      res.status(200).send(findAllMessage);
    } catch (error) {
      res
        .status(500)
        .json({ error: error instanceof Error ? error.message : "Server error" });
    }
  };
  export const getSinglePersonMessage = async (req: Request, res: Response) => {
    try {
      const findAllMessage = await UserMessages.findById(req.params.id).exec();
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