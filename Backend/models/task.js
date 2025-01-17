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
            type: Number, 
            required: true,
            enum: [1,2,3,4,5], 
        },
        created_By: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: "User", // Name of the User model
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "finished"]
        }
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
