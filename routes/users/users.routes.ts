import express, { Request, Response, Router } from "express";
import { isAdmin } from "../../controllers/authorizationController/authorizationController";
import { isAdminMiddleware } from "../../middleware/authMiddleware";
import { RegisterModel } from "../../models/register.models";

const router: Router = express.Router();

router.route("/users").get(async (req: Request, res: Response) => {
  try {
    const users = await RegisterModel.find(); // Query user by email

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Send back user data
    res.status(200).send({ users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.route("/user/:email").get(async (req: Request, res: Response) => {
  try {
    const email = req.params.email; // Get email from params
    const user = await RegisterModel.findOne({ email }); // Query user by email

    if (!email) {
      return res.status(400).json({ message: "No email provided" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back user data
    res.status(200).send({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router
  .route("/user/:email")
  .patch(async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const user = await RegisterModel.findOne({ email });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Update user fields with the data from the request body
      const updatedFields = req.body; // This will take the updated user data from the request
      Object.assign(user, updatedFields); // Merge the updated fields into the user object

      await user.save(); // Save the updated user data to the database

      // Send back the updated user data
      res.status(200).send({
        user: {
          companyName: user.companyName,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus, // Include the subscription status
          selectedPackage: user.selectedPackage, // Include the selected package
        },
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).send({ message: "Error updating user data" });
    }
  });



  router.route("/admin").get(isAdminMiddleware ,isAdmin);

export default router;
