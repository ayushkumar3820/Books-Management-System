import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongodb = await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("Database connected successfully", mongodb.connection.host);
    return mongodb;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
