import mongoose from "mongoose";

const SubscriptionDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
})

export const SubscriptionDataSchemaModel = mongoose.model("SubscriptionData",SubscriptionDataSchema)