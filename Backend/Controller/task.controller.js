import { Task } from "../models/task.js";

export const createTask = async (req, res) => {
    try {
        const { taskName, startTime, endTime, priority, status } = req.body;

        // Validate input
        if (!taskName || !startTime || !endTime || !priority || !status) {
            return res.status(400).json({
                message: "Insufficient data. All fields are required.",
                success: false,
            });
        }

        const created_By = req.id;

        // Validate time range
        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({
                message: "Start time must be earlier than end time.",
                success: false,
            });
        }
        // Creating the task
        const task = await Task.create({
            taskName,
            startTime,
            endTime,
            priority,
            created_By,
            status,
        });

        return res.status(201).json({
            message: "Task created successfully.",
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error while creating task.",
            success: false,
        });
    }
};

// Editing a task
export const editTask = async (req, res) => {
    try {
        const { taskId, taskName, startTime, endTime, priority, status } = req.body;
        const userId = req.id; // User ID from isAuthenticated middleware

        // Validate taskId
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required.",
                success: false,
            });
        }


        // Find the task and ensure it belongs to the logged-in user
        const task = await Task.findById({ _id: taskId, created_By: userId });

        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
                success: false,
            });
        }

        // Validate time range if provided
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({
                message: "Start time must be earlier than end time.",
                success: false,
            });
        }

        // Update fields if provided
        if (taskName) task.taskName = taskName;
        if (startTime) task.startTime = startTime;
        if (endTime) task.endTime = endTime;
        if (priority) task.priority = priority;
        if (status) task.status = status;

        // Save the updated task
        await task.save();

        return res.status(200).json({
            message: "Task updated successfully.",
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error while updating task.",
            success: false,
        });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Task id not found"
            });
        }
        const resposne = await Task.deleteOne({ _id: id });

        if (resposne.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Task Not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Deleted successfully"
        })



    } catch (error) {
        console.log(error);
    }
}