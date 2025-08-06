import { Task } from "../models/task.js";
import { getGenAITaskEmbedding } from "./geminiAPI.controller.js";
import { getTaskEmbedding } from "./openAIAPI.controller.js";

// const isDuplicate = async (newEmbeddings) => {
//     const tasks = await Task.find({}, {})
// }

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

        const embedding = await getGenAITaskEmbedding(description);

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
            embedding,
            comments,
            created_by: req.id
        })

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

        const tasks = await Task.find({ created_by: req.id });

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

        const taskById = await Task.findById(id);

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

        const taskById = await Task.findById(id);

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


