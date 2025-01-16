import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectTrigger, SelectItem } from '../ui/select';
import Navbar from '../shared/Navbar';

const CreateTasks = () => {
    // const navigate = useNavigate();
    // const [taskName, setTaskName] = useState('');
    // const [startTime, setStartTime] = useState('');
    // const [endTime, setEndTime] = useState('');
    // const [priority, setPriority] = useState('');


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const url = `${USER_API_END_POINT_TASK}/createTask`

    //     const token = sessionStorage.getItem("token");

    //     if(!token){
    //         alert("User is not authenticated!");
    //         navigate('/login');
    //         return;
    //     }

    //     try {

    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': "application/json",
    //             },
    //             withCredentials: true,
    //             body: JSON.stringify({
    //                 taskName,
    //                 startTime,
    //                 endTime,
    //                 priority,
    //             })
    //         })
    //         console.log("Task Data", response);

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error("Error Data:", errorData);
    //             alert(`Login failed: ${errorData.message}`);
    //             return;
    //         }

    //         const data = await response.json();
    //         console.log(data);

    //     } catch (error) {
    //         console.error("Error during login:", error);
    //         alert("An error occurred while logging in. Please try again later.");
    //     }
    // };

    return (
        <>
            <div>
                <Navbar />
                <div className="max-w-md lg:mt-20 mx-auto p-4  shadow-md rounded-md">
                    <h1 className="text-2xl  font-semibold mb-4">Create Task</h1>
                    {/* {message && (
                        <Alert variant={isSuccess ? 'success' : 'error'} className="mb-4">
                            {message}
                        </Alert>
                    )} */}
                    <form >
                        {/* Task Name */}
                        <div className="mb-4">
                            <label htmlFor="taskName" className="block font-medium">
                                Task Name
                            </label>
                            <Input
                                id="taskName"
                                type="text"
                                required
                                placeholder="Enter task name"
                            />
                        </div>

                        {/* Start Time */}
                        <div className="mb-4">
                            <label htmlFor="startTime" className="block font-medium">
                                Start Time
                            </label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                required
                            />
                        </div>

                        {/* End Time */}
                        <div className="mb-4">
                            <label htmlFor="endTime" className="block  font-medium">
                                End Time
                            </label>
                            <Input
                                id="endTime"
                                type="datetime-local"
                                required
                            />
                        </div>

                        {/* Priority */}
                        <div className="mb-4">
                            <label htmlFor="priority" className="block font-medium">
                                Priority
                            </label>
                            <Select
                                required
                            >
                                <SelectTrigger placeholder="Select Priority">
                                    
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button type="submit" className="w-full">
                                Create Task
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateTasks;