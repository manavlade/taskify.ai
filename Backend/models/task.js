import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date, 
            required: true,
        },
        endTime: {
            type: Date, 
            required: true,
        },
        priority: {
            type: String, 
            required: true,
            enum: ["Low", "Medium", "High"], 
        },
        created_By: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: "User", // Name of the User model
            required: true,
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
