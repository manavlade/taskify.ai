import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login } from "@/api/Auth";
import loginImage from "../../assets/login 1.png"
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Navbar from "../shared/Navbar";
import { useTheme } from "../theme-provider";

const logInSchema = z.object({
    email: z.string().email("Please enter proper email"),
    password: z.string().min(6, "password must be atleast 6 letters long")
})

const LoginForm = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(logInSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await Login(data.email, data.password);

            alert(response.message);

            navigate('/dashboard');
        }
        catch (error) {
            console.log(error);
        }
        finally {
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
                                {isLoading ? "Logging in..." : "Log In"}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="text-sm text-center mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/signUp"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                SignUp
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

export default LoginForm;
