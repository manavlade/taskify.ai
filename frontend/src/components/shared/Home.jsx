import { Badge } from "react-bootstrap";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import TaskManagementBenefits from "./benefits";
import hero from "../../assets/hero.mp4"

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Section */}
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
           
            <h1 className="text-4xl font-bold leading-tight text-gray-800">
              Empower Your Productivity with Our Task Management App
            </h1>
            <p className="text-gray-600 text-lg">
              Our Task Management System simplifies your workflow, helping you
              stay organized and focused. Easily create, edit, and track your
              tasks all in one place.
            </p>
            <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Get Started
            </Button>
          </motion.div>

          {/* Right Section */}

          <motion.div
            className="flex-1 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <video
              src={hero}
              autoPlay
              loop
              muted
              className="w-3/2 h-2/3"
            />
          </motion.div>
        </div>
      </div>
      <TaskManagementBenefits />
    </>
  );
};

export default Home;
