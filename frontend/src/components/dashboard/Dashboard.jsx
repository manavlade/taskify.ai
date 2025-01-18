import { useQuery } from "@tanstack/react-query";
import Navbar from "../shared/Navbar";
import { GetUserById } from "@/api/Auth";
import { Badge } from "../ui/badge";


const Dashboard = () => {
    const { data: userDetails, isError, isLoading, error } = useQuery({
        queryKey: ["userData"],
        queryFn: GetUserById,
    })

    if(isLoading) return <p>Loading ...</p>

    if (isError) return <p> Error: {error.message || "something went wrong"} </p>

    return (
        <>
            <div>
                <Navbar />
                <div>
                    <p className=" text-5xl" >
                        Welcome {userDetails.user.fullName} 👋
                    </p>
                </div>

                <p>List of tasks </p>

                <div className=" flex justify-center gap-5" >
                    <Badge className=" text-2xl" >Pending</Badge>
                    <Badge className=" text-2xl">Completed</Badge>
                    <Badge className=" text-2xl">Most Priority</Badge>

                </div>

            </div>
        </>
    )
}
export default Dashboard;