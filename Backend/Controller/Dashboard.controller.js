import { Task } from "../models/task";

export const getDashboardData = async () => {
    try {

        const currentTime = new Date();

        const pipeline = [
            {
                $facet: {
                    totalTasks: [
                        { $count: "count" }
                    ],

                    statusCount: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    pendingTasks: [
                        {
                            $match:
                                { status: "pending" }
                        },
                        {
                            $project: {
                                priority: 1,
                                timeLapssed: {
                                    $max: [{
                                        $subtract: [currentTime, "$startTime"]
                                    }, 0]
                                },
                                balanceTime: {
                                    $max: [{
                                        $subtract: ["$endTime", currentTime]
                                    }, 0]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$priority",
                                totalTimeLapsed: { $sum: "$timeLapssed" },
                                totalBalanceTime: { $sum: "$balanceTime" }
                            }
                        }
                    ],

                    averageCompletionTime: [
                        { $match: { status: "finished" } },
                        {
                            $group: {
                                _id: null,
                                averageTime: {
                                    $avg: { $subtract: ["$endTime", "$startTime"] }
                                }
                            }
                        }
                    ]
                }
            }
        ];

        const [result] = await Task.aggregate(pipeline);

        const totalTasks = result.totalTasks[0]?.count || 0;

        const statusCounts = result.statusCount.reduce(
            (acc, { _id, count }) => {
                acc[_id] = count;
                return acc;
            },

            { pending: 0, finished: 0 }
        );

        const pendingTaskStats = result.pendingTasks.map((task) => ({
            priority: task._id,
            totalTimeLapsed: task.totalTimeLapsed / (1000 * 60 * 60), // ms to hours
            totalBalanceTime: task.totalBalanceTime / (1000 * 60 * 60) // ms to hours
        }));

        const averageCompletionTime = result.averageCompletionTime[0]?.averageTime / (1000 * 60 * 60) || 0;

        return res.status(200).json({
            success: true,
            totalTasks,
            statusPercentages: {
                pending: (statusCounts.pending / totalTasks) * 100 || 0,
                finished: (statusCounts.finished / totalTasks) * 100 || 0
            },
            pendingTaskStats,
            averageCompletionTime
        });
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }


}