import { axiousInstance } from "../axiousInstance";

export const CreateTask = async (
    taskName,
    startTime,
    endTime,
    priority,
    status,
    description,
    startDate,
    endDate
) => {
    try {
        const response = await axiousInstance.post("/task/createTask", {
            taskName,
            startTime,
            endTime,
            priority,
            status,
            description,
            startDate,
            endDate,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error);
        throw error.response?.data || { message: "Failed to create task." };
    }
};

export const EditTask = async (editTaskData) => {
    try {
        const response = await axiousInstance.put('/task/editTask', editTaskData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}