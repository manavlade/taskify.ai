import { useQuery } from "@tanstack/react-query";
import Navbar from "../shared/Navbar";
import { GetUserById } from "@/api/Auth";
import { getDashboardData } from "@/api/dashboard";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Filter, Pencil, Plus, Search, Square, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MagicCard } from "../ui/magic-card";
import { useTheme } from "../theme-provider";
import { format } from "date-fns";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreateTasks from "../tasks/CreateTasks";


const Dashboard = () => {
    const { theme } = useTheme();
    const { data: userDetails, isError: userError, isLoading, error: userDetailError } = useQuery({
        queryKey: ["userData"],
        queryFn: GetUserById,
        staleTime: 5 * 60 * 1000,
    })
    console.log(userDetails);

    const { data: dashboardData, isError: dashError, isLoading: dashLoading, error: dashDetailError } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData,
        staleTime: 5 * 60 * 1000,
    })
    console.log(dashboardData)

    // Handle loading or error states
    if (isLoading || dashLoading) return <p>Loading...</p>;
    if (userError || dashError) return <p>Error: {userDetailError?.message || dashDetailError?.message}</p>;

    return (
        <>
            <div>
                <Navbar />
                <div>
                    <p className=" text-4xl font-bold mb-6 text-center" >
                        Welcome {userDetails.user.fullName} 👋

                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 px-4 sm:px-10 mt-10">
                    <MagicCard
                        className="flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold shadow-lg rounded-md p-4"
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    >
                        <div className="text-center">
                            Total tasks {dashboardData?.totalTasks}
                        </div>
                    </MagicCard>

                    <MagicCard
                        className="flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold shadow-lg rounded-md p-4"
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    >
                        <div className="text-center">
                            Pending Tasks: {dashboardData?.statusPercentages?.pending}%
                        </div>
                    </MagicCard>

                    <MagicCard
                        className="flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold shadow-lg rounded-md p-4"
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    >
                        <div className="text-center">
                            Completed Tasks: {dashboardData?.statusPercentages?.finished}%
                        </div>
                    </MagicCard>

                    <MagicCard
                        className="flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold shadow-lg rounded-md p-4"
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    >
                        <div className="text-center">
                            Average Completion <br /> Time: {dashboardData?.averageCompletionTime}
                        </div>
                    </MagicCard>
                    <MagicCard
                        className="flex flex-col items-center justify-center text-xl sm:text-2xl font-semibold shadow-lg rounded-md p-4"
                        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                    >
                        <div className="text-center">
                            {/* Calculate and display the total balance time left */}
                            Total Balance Time Left:{" "}
                            {dashboardData?.pendingTaskStats
                                ? (
                                    dashboardData.pendingTaskStats.reduce(
                                        (total, task) => total + task.totalBalanceTime,
                                        0
                                    ) /
                                    (1000 * 60 * 60) // Convert milliseconds to hours
                                ).toFixed(2)
                                : "N/A"}{" "}
                            hours
                        </div>
                    </MagicCard>

                </div>


                <div className=" flex  px-10 py-10 justify-between gap-5" >
                    <div className="relative w-full sm:w-1/3 flex items-center border border-white">
                        <Input
                            className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            type="search"
                            placeholder="Search tasks..."
                        />
                        <Search
                            className="absolute left-3 text-gray-400 pointer-events-none"
                        />
                    </div>
                    <div className=" flex gap-5" >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Filter /> Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter Task by</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Task Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Task Priority
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Task Startime
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Task EndTime
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      <CreateTasks/>
                    </div>
                </div>

                <div className=" px-10 ">
                    <Table className=" rounded-lg" >
                        <TableCaption>A List of Your Tasks</TableCaption>
                        <TableHeader className="" >
                            <TableRow className=" font-bold" >
                                <TableHead>
                                </TableHead>
                                <TableHead>
                                    Task Name
                                </TableHead>
                                <TableHead>
                                    Start Time
                                </TableHead>
                                <TableHead>
                                    End Time
                                </TableHead>
                                <TableHead>
                                    Priority
                                </TableHead>
                                <TableHead>
                                    status
                                </TableHead>
                                <TableHead>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                userDetails?.tasks?.map((task, index) => (
                                    <TableRow key={index} >
                                        <TableCell> <Square /> </TableCell>
                                        <TableCell>{task.taskName}</TableCell>
                                        <TableCell>
                                            {format(new Date(task.startTime), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(task.endTime), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={task.priority > 3 ? "destructive" : "default"}
                                                className="px-2 py-1"
                                            >
                                                {task.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell>
                                            <div className=" flex gap-2 cursor-pointer" >
                                                <Pencil className=" text-blue-500" onClick={() => alert("edit clicked")} />
                                                <Trash2Icon className=" text-red-500" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>

            </div>
        </>
    )
}
export default Dashboard;