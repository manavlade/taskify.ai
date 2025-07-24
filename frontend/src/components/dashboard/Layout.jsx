import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { useState } from "react";
import Navbar from "../shared/Navbar";

const DashboardLayout = ({ children }) => {
    const [open, setIsOpen] = useState(true);
    return (
        <div>
            <Navbar/>
            <SidebarProvider>
                {/* <SidebarTrigger /> jab sidebar close ho raha tha to ye dikh raha tha  */}
                <AppSidebar />
                <main className="">a
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
};

export default DashboardLayout;
