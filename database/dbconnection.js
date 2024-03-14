import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env " });

const dbConnection = async () => {
    console.log(process.env.MONGO_URL)
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            
            dbName: "Trade-club",
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
};
export default dbConnection;
