import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export async function connectDb() {
    let DATABASE_URL = process.env.DATABASE_URL
    await mongoose.connect(DATABASE_URL as string);
    mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
}