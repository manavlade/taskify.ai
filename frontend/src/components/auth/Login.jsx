import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login } from "@/api/Auth";

const logInSchema = z.object({
    email: z.string().email("Please enter proper email"),
    password: z.string().min(6, "password must be atleast 6 letters long")
})

const LoginForm = () => {
    const navigate = useNavigate();
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
        <div>

            <div className="flex items-center justify-center pt-16">
                <div className="w-full max-w-md p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center  mb-6">
                        Login to Your Account
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} >
                        {/* Email Field */}
                        <div className="mb-4">
                            <Label className="block mb-2 text-sm font-medium ">
                                Enter Your Email Address
                            </Label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && <p className=" text-red-500 text-sm" > {errors.email.message} </p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <Label className="block mb-2 text-sm font-medium ">
                                Enter Your Password
                            </Label>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.password && <p className=" text-red-500 text-sm" > {errors.password.message} </p>}
                        </div>

                        {/* Login Button */}
                        <div className="mb-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 rounded-lg transition duration-300"
                            >
                                {isLoading ? "Logining you in...." : "Login"}
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-sm text-center text-gray-600">
                            Don't have an account?{" "}
                            <Link to='/signUp' >
                                <span className="text-black font-semibold hover:underline cursor-pointer">
                                    Sign Up Now
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
