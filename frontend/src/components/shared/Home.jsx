import { Badge } from "react-bootstrap";
import { Button } from "../ui/button";
import Navbar from "./Navbar";

const Home = () => {
    return (
      <>
      <div>
        <Navbar/>
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold  mb-8">Task Management System</h1>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className=" p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                <p className=" mb-4">Add a new task with details like name, deadline and priority</p>
                  <Button className="w-full" variant="outline" onClick={() => navigate('/create-task')}>
                  Create Task
                </Button>
              </div>

              <div className="p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold  mb-4">View Tasks</h2>
                <p className=" mb-4">See all your tasks and track their progress</p>
                <Button className="w-full" variant="outline" onClick={() => navigate('/tasks')}>
                  View All Tasks
                </Button>
              </div>

              <div className=" p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold  mb-4">Task Analytics</h2>
                <p className=" mb-4">Get insights about your task completion and productivity</p>
                <Button className="w-full" variant="outline" onClick={() => navigate('/analytics')}>
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Recent Tasks Section */}
            <div className=" rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold ">Recent Tasks</h2>
                <Button variant="ghost" onClick={() => navigate('/tasks')}>View All</Button>
              </div>
              
              <div className="space-y-4">
                {/* Sample Task Items - Replace with actual data */}
                <div className="flex items-center justify-between p-4  rounded-lg">
                  <div>
                    <h3 className="font-medium ">Project Planning</h3>
                    <p className="text-sm ">Due: Tomorrow at 5:00 PM</p>
                  </div>
                    <Button>
                      Low Priority
                    </Button>
                </div>

                <div className="flex items-center justify-between p-4  rounded-lg">
                  <div>
                    <h3 className="font-medium ">Client Meeting</h3>
                    <p className="text-sm ">Due: Today at 2:00 PM</p>
                  </div>
                    <Button>
                      Low Priority
                    </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium ">Documentation</h3>
                    <p className="text-sm ">Due: Next Week</p>
                  </div>
                  <Button>
                    Low Priority
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
}

export default Home;