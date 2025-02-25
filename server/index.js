import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import router from "./src/Router/user.js";
import { connectDB } from "./src/Database/data.js";

const app = express();

configDotenv();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PATCH", "DELETE"], 
    credentials: true,
  })
);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;

  app.use("/api", router);

  app.get("/", (req, res) => {
    res.send("Server is running...");
  });

  app.listen(PORT, () => {
    console.log(`Server is working on Port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup error:", error);
});
