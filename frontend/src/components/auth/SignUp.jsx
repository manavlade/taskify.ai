import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Register } from "@/api/Auth";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const signUpSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "password must be atleast 6 characters long")
})

const SignUp = () => {
    const navigate = useNavigate();
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
        <div className="flex  items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Sign Up
                </h2>
                <form  onSubmit={handleSubmit(onSubmit)} >
                    {/* Name Field */}
                    <div className="mb-4">
                        <Label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            {...register("fullName")}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                        {errors.fullName && <p className=" text-red-500 text-sm" > {errors.fullName.message} </p>}
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled= {isLoading}
                        className="w-full py-2 bg-black text-white rounded-lg "
                    >
                        { isLoading ? "Creating Account..." : "Sign Up" }
                    </Button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to='/login' >
                        <span className="text-black font-semibold hover:underline cursor-pointer">
                            Log In
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
