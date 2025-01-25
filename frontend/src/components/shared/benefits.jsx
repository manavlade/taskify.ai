import { Button } from "@/components/ui/button";
import { LucideBox } from "lucide-react";

const TaskManagementBenefits = () => {
    return (
        <>
            <p className="text-sm font-medium text-center uppercase">
                Efficiency
            </p>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center p-5">
                {/* Left Content */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">
                        Transform Your Task Management Experience Today
                    </h1>
                    <p className="text-lg ">
                        Our dashboard simplifies task management, enabling you to stay
                        organized and focused. Experience seamless tracking and prioritization
                        for all your projects.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center space-x-4">
                            <LucideBox className="w-8 h-8 " />
                            <div>
                                <h3 className="font-semibold">Stay Organized</h3>
                                <p className="text-sm ">
                                    Easily manage your tasks and deadlines in one intuitive
                                    platform.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LucideBox className="w-8 h-8  text-blue-800" />
                            <div>
                                <h3 className="font-semibold">Boost Productivity</h3>
                                <p className="text-sm ">
                                    Maximize your efficiency with powerful tools designed for
                                    effective task management.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button className="bg-blue-600 text-white">Get Started</Button>
                        <Button variant="outline">Learn More</Button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex justify-center items-center bg-gray-200 h-64 rounded-lg">
                    <img
                        src="/placeholder-image.png"
                        alt="Task Management Dashboard"
                        className="object-contain"
                    />
                </div>
            </section>
        </>
    );
};

export default TaskManagementBenefits;
