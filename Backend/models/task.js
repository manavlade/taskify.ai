import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            required: true,
            enum: ["low", "moderate", "high", "critical"],
            default: "low"
        },
        status: {
            type: String,
            required: true,
            enum: ["To-Do", "In-Progress"],
            default: "To-Do"
        },
        comments: {
            type: String,
            required: true,
        },
        estimatedTime: {
            type: Number,
        },
        actualTime: {
            type: Date,
            default: Date.now,
        },
        // embedding: {
        //     type: [Number]
        // },
        completed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vectorized: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
