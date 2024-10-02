import mongoose from "mongoose";

const SubscriptionDataSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    age : Number
})

export const SubscriptionDataSchemaModel = mongoose.model("collection_name",SubscriptionDataSchema)