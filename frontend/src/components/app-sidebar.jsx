import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"

import {
    ChartNoAxesColumn,
    ChartNoAxesCombined,
    ClipboardList,
    Home,
    Plus
} from "lucide-react"

const item = [
    {
        title: "Workspace",
        url: "/dashboard",
        icon: Home,
        className: " text-xl font-bold"
    },
    {
        title: "Create Task",
        url: 'createTasks',
        icon: Plus,
        className:" text-xl font-bold "
    },
    {
        title: "Tasks",
        url: '/tasks',
        icon: ClipboardList,
        className: " text-xl font-bold"
    },
    {
        title: "Analytics",
        url: '/analytics',
        icon: ChartNoAxesCombined,
        className: " text-xl font-bold"
    },
    {
        title: "Chart",
        url: '/charts',
        icon: ChartNoAxesColumn,
        className: " text-xl font-bold"
    }
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <span className=" text-3xl font-bold px-10 py-10" >
                            Effico
                        </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className=" py-10 " >
                            <SidebarMenu>
                                {
                                    item.map((item) => (
                                        <SidebarMenuItem key={item.title} >
                                            <SidebarMenuButton asChild >
                                                <a href={item.url}  className="flex items-center gap-4 mt-12 px-10 " >
                                                    <item.icon  />
                                                    <span className={item.className} >
                                                        {item.title}
                                                    </span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                            </SidebarMenu>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
