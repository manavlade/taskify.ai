import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js"

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions))


const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on Port ${PORT}`)
})