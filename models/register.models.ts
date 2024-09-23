import mongoose from "mongoose";

const RegisterSchema  = new mongoose.Schema({
    name:{
        type:String
    },
    photo:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
});

export const RegisterModel = mongoose.model("registerCollections", RegisterSchema )