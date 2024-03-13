import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const Artical = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name!"],
        minLength: [1, "Name must contain at least 3 Characters!"],
        maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    title: {
        type: String,
        required: [true, "Please enter your Titel!"],
        minLength: [1, "Titel must contain at least 3 Characters!"],
        maxLength: [30, "Titel cannot exceed 30 Characters!"],
    },
    description:{
        type: String,
        required: [true, "Please enter your Description!"],
        minLength: [1, "Description must contain at least 3 Characters!"],
    },
    content: {
        type: String,
        required: [true, "Please enter your Content!"],
        minLength: [1, "Content must contain at least 3 Characters!"],
    },
    Likes: {
        type: Number,
        default: 0,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Articals = mongoose.model("Artical", Artical);
