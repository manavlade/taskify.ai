import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { Task } from "../models/task.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Insuffient data",
                success: false,
            });
        };

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Email already exists",
                success: false,
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);


        await User.create({
            fullName,
            email,
            password: hashedPassword,

        })

        return res.status(200).json({
            message: "Account created successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }

}


export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Insufficient data",
                success: false,
            });
        }


        let user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        const isHassedMatch = await bcrypt.compare(password, user.password);

        if (!isHassedMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        }


        const tokenData = {
            userId: user._id,
        }

        //➡️ This creates a payload for the JWT (JSON Web Token).
        //It includes the user's MongoDB _id, which uniquely identifies the user.



        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        }).json({
            message: `Welcome back ${user.fullName}`,
            success: true,
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout Successfull",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Create an account first.",
            });
        }

        const tasks = await Task.find({ created_By: id });

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            tasks,
        });
    } catch (error) {
        console.error("Error fetching user and tasks by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
