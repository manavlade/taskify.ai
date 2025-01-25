import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Register } from "@/api/Auth";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Navbar from "../shared/Navbar";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import loginImage from "../../assets/login2.png"

const signUpSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "password must be atleast 6 characters long")
})

const SignUp = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data) => {
        console.log(data);
        setIsLoading(true);
        try {
            const response = await Register(data.fullName, data.email, data.password);
            console.log(response);

            // localStorage.setItem('token', response.token);

            alert("registeration Successfull redirecting to login page")

            navigate('/login');

        } catch (error) {
            const errorMessage = error.message || "Registration failed. Please try again.";
            alert(errorMessage);

        }
        finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 flex-col md:flex-row w-full">
                {/* Right Section: Login Form */}
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-4 text-center">
                            Log in to your account
                        </h1>
                        <p className="text-sm text-center mb-6">
                            Welcome back! Select a method to log in:
                        </p>
                        <Separator className="my-4" />

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <Label htmlFor="name" className="mb-2 block text-sm font-medium">
                                   Enter Name
                                </Label>
                                <Input
                                    id="name"
                                    type="name"
                                    placeholder="Enter Your Name"
                                    {...register("fullName")}
                                    className={cn(
                                        "w-full",
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            {/* Email Field */}
                            <div className="mb-4">
                                <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                                    Email id
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Email address"
                                    {...register("email")}
                                    className={cn(
                                        "w-full",
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <Label htmlFor="password" className="mb-2 block text-sm font-medium">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create Password"
                                    {...register("password")}
                                    className={cn(
                                        "w-full",
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    )}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="mb-6 text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="text-sm text-center mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Left Section: Image */}
                <div
                    className={`hidden md:flex w-full md:w-full items-center justify-center ${theme === "light" ? "bg-black" : "bg-white"
                        }`}
                >
                    <img
                        src={loginImage}
                        alt="Login Illustration"
                        className="max-w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
