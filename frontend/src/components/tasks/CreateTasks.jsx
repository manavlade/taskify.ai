import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Plus, Workflow } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTask } from "@/api/tasks";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";

// Zod Schema for Validation
const CreateTaskSchema = z.object({
    taskName: z.string().min(3, "Task name must be at least 3 letters long"),
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    description: z.string().optional(),
    priority: z.number().min(1).max(5, "Priority must be between 1 and 5"),
    status: z.enum(["To-Do", "pending", "finished"]),
});

const CreateTasks = () => {
    const [showDescription, setShowDescription] = useState(false); // Description toggle

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(CreateTaskSchema),
    });
    const mutation = useMutation({
        mutationFn: (data) => CreateTask(
            data.taskName,
            data.startTime,
            data.endTime,
            data.priority,
            data.status,
            data.description,
            data.startDate,
            data.endDate
        ),
        onSuccess: () => {
            console.log("Task created successfully!");

            alert("Task Created successfully")
            reset(); // Reset the form
        },
        onError: (error) => {
            console.error("Failed to create task:", error);
            alert("Task Creation failed");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data); // Pass form data to the mutation
    };
    
    // const onSubmit = async (data) => {
    //     try {
    //         await CreateTask(
    //             data.taskName,
    //             data.startTime,
    //             data.endTime,
    //             data.priority,
    //             data.status,
    //             data.description,
    //             data.startDate,
    //             data.endDate
    //         );
    //         alert("Task created successfully!");
    //         reset(); 
    //     } catch (error) {
    //         alert(error.message || "Failed to create task");
    //     }
    // };

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 ">
                        <Plus /> New Task
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl p-6">
                    {/* Header */}
                    <AlertDialogHeader className="text-center">
                        <AlertDialogTitle>
                            <div className="flex justify-center items-center gap-3 text-2xl font-bold">
                                CREATE TASK <Workflow className="" />
                            </div>
                        </AlertDialogTitle>
                        <Separator className="mt-3" />
                    </AlertDialogHeader>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Task Name */}
                        <div>
                            <Label htmlFor="taskName" className="font-black text-sm">
                                Task Name
                            </Label>
                            <Input
                                id="taskName"
                                type="text"
                                placeholder="Enter task name"
                                className="w-full"
                                {...register("taskName")}
                            />
                            {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName.message}</p>}
                        </div>

                        {/* Toggle Description */}
                        <div>
                            <button
                                type="button"
                                className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"
                                onClick={() => setShowDescription(!showDescription)}
                            >
                                {showDescription ? "Hide Description" : "Add Description"}
                            </button>
                            {showDescription && (
                                <div className="mt-4">
                                    <Label htmlFor="description" className="font-black text-sm">
                                        Task Description
                                    </Label>
                                    <Input
                                        id="description"
                                        type="text"
                                        placeholder="Enter task description"
                                        className="w-full"
                                        {...register("description")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="startDate" className="font-bold text-sm">
                                    Start Date
                                </Label>
                                <Input id="startDate" type="date" {...register("startDate")} />
                            </div>
                            <div>
                                <Label htmlFor="startTime" className="font-bold text-sm">
                                    Start Time
                                </Label>
                                <Input id="startTime" type="time" {...register("startTime")} />
                            </div>
                            <div>
                                <Label htmlFor="endDate" className="font-bold text-sm">
                                    End Date
                                </Label>
                                <Input id="endDate" type="date" {...register("endDate")} />
                            </div>
                            <div>
                                <Label htmlFor="endTime" className="font-bold text-sm">
                                    End Time
                                </Label>
                                <Input id="endTime" type="time" {...register("endTime")} />
                            </div>
                        </div>

                        {/* Priority & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="priority" className="font-bold text-sm">
                                    Priority
                                </Label>
                                <select
                                    id="priority"
                                    className="w-full p-2 border rounded-md mt-2"
                                    {...register("priority", { valueAsNumber: true })}
                                >
                                    {[1, 2, 3, 4, 5].map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="status" className="font-bold text-sm">
                                    Status
                                </Label>
                                <select
                                    id="status"
                                    className="w-full p-2 border rounded-md mt-2"
                                    {...register("status")} // Correctly registering the "status" field
                                >
                                    {["To-Do", "pending", "finished"].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full ">
                            Create Task
                        </Button>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CreateTasks;
