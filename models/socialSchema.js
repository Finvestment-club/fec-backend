import Mongoose  from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });


const socialSchema = new Mongoose.Schema({ 
    name: {
        type: String,
        required: [true, "Please enter your name"],
      //  maxLength: [30, "Your name cannot exceed 30 characters"],
      //  minLength: [4, "Your name must be at least 4 characters long"], 
    },
    title:{
        type: String,
        required: [true, "Please enter your Titel!"],
        minLength: [1, "Titel must contain at least 3 Characters!"],
        // maxLength: [30, "Titel cannot exceed 30 Characters!"],
    },
    links:{
        type: String,
        required: [true, "Please enter your Links!"],
        minLength: [1, "Links must contain at least 3 Characters!"],
        // maxLength: [30, "Links cannot exceed 30 Characters!"],
    },
    images: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    postedBy: {
        type: Mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


});


export const Socials=  Mongoose.model("Social", socialSchema);
 