import { Task } from "../models/task.js";
import { getGenAIDuplicateTaskDetection, getGenAITaskEmbedding } from "./geminiAPI.controller.js";

import dotenv from "dotenv"
import { Pinecone } from "@pinecone-database/pinecone";


dotenv.config();

const pinecone = new Pinecone({
    apiKey: `${process.env.PINECONE_API_KEY}`,
})

const indexName = 'task'

const index = pinecone.Index(indexName);

export const createTask = async (req, res) => {
    try {
        const {
            name,
            image,
            description,
            startDate,
            endDate,
            priority,
            status,
            estimatedTime,
            actualTime,
            comments
        } = req.body;

        if (!name || !description || !startDate || !endDate || !priority || !status || !estimatedTime || !comments) {
            return res.status(400).json({
                message: "Insufficient data",
                success: false,
            });
        }

        // const duplicateTask = await getGenAIDuplicateTaskDetection(embedding);

        // if (duplicateTask) {
        //     return res.status(400).json({
        //         message: "Duplicate task detected",
        //         success: false,
        //     });
        // }

        const task = await Task.create({
            name,
            image,
            description,
            startDate,
            endDate,
            priority,
            status,
            estimatedTime,
            actualTime,
            comments,
            created_by: req.id
        })

        const text = `Name: ${name}\nDescription: ${description}\nStartDate: ${startDate}\nEndDate: ${endDate}\nPriority: ${priority}\nStatus: ${status}\nComments: ${comments}`;

        const vectorEmbedding = await getGenAITaskEmbedding(text);

        await index.upsert([
            {
                id: task._id.toString(),
                values: vectorEmbedding,
                metadata: {
                    task_id: task._id.toString(),
                    name,
                    description,
                    startDate,
                    endDate,
                    priority,
                    status,
                    estimatedTime,
                    actualTime,
                    comments,
                    created_by: req.id
                }
            }
        ])

        task.vectorized = true;
        await task.save();

        return res.status(200).json({
            message: "Task created successfully",
            success: true,
            task,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })

    }
}

export const GetAllTask = async (req, res) => {
    try {

        const tasks = await Task.find({ created_by: req.id }).select("-embedding");

        return res.status(200).json({
            message: "Tasks fetched successfully",
            success: true,
            tasks,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}

export const GetTaskById = async (req, res) => {
    try {

        const id = req.params.id;

        const taskById = await Task.findById(id).select("-embedding");

        if (!taskById) {
            return res.status(404).json({
                message: `Task with ${id} not found`,
                success: false
            })
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            success: true,
            taskById,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}


export const EditTask = async (req, res) => {
    try {

        const id = req.params.id;

        const taskById = await Task.findById(id).select("-embedding");

        if (!taskById) {
            return res.status(404).json({
                message: `Task with ${id} not found`,
                success: false
            })
        }

        const updates = req.body;

        const updatedTaskData = await Task.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedTaskData) {
            return res.status(404).json({
                message: `Task with ${id} not found`,
                success: false
            })
        }

        return res.status(200).json({
            message: "Task updated successfully",
            success: true,
            updatedTaskData,
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })

    }
}

export const switchTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const date = new Date();

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required",
                success: false
            })
        }

        const tasks = await Task.findById(taskId).select("-embedding");

        if (!tasks) {
            return res.status(404).json({
                message: `Task with ${taskId} not found`,
                success: false
            })
        }

        if (tasks.completed) {
            tasks.completed = false;
            tasks.actualTime = tasks.endDate
        } else {
            tasks.completed = true;
            tasks.actualTime = date;
        }

        await tasks.save();

        return res.status(200).json({
            message: `Task marked as ${tasks.completed ? "completed" : "incomplete"}`,
            success: true,
            tasks,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}
