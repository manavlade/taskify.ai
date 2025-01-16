import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { LogOut, Settings, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from '../theme-provider';
import { useQuery } from '@tanstack/react-query';
import { GetUserById } from '@/api/Auth';

const Navbar = () => {
    const { setTheme } = useTheme()
    const navigate = useNavigate();

    const { data: userLogin } = useQuery({
        queryKey: ["user"],
        queryFn: GetUserById,
    })
    
    return (
        <div className=" shadow-lg py-2">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                        Task Management System
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                    <ul className="hidden md:flex items-center space-x-6 font-medium ">
                        <li className=" cursor-pointer transition-colors duration-200">
                            <Link to="/">Home</Link>
                        </li>
                        <li className=" cursor-pointer transition-colors duration-200">
                            <Link to="/createTasks">Create Tasks</Link>
                        </li>
                        <li className=" cursor-pointer transition-colors duration-200">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Auth Buttons / User Menu */}
                    {!userLogin ? (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="outline" className="hidden sm:inline-flex">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signUp">
                                <Button className="">
                                    SignUp
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-68 p-4 mt-5 border border-gray-200 shadow-lg rounded-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                            <h4 className="font-semibold text-gray-900"> {userLogin.user.fullName }</h4>
                                            <p className="text-sm text-gray-500"> {userLogin.user.email} </p>
                                    </div>
                                </div>
                                <hr className="my-2" />
                                <div className="flex flex-col space-y-2">
                                    <Button onClick= {() =>  navigate('/dashboard')} variant="link" className="flex items-center text-xl w-full text-gray-700 hover:text-purple-600">
                                        <User2 className="w-6 h-6 mr-3" /> Dashboard
                                    </Button>
                                    
                                    <Button variant="link" className="flex items-center text-xl w-full text-red-600 hover:text-red-700">
                                        <LogOut className="w-6 h-6 mr-3" /> Logout
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
