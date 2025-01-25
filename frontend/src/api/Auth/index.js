import { axiousInstance } from "../axiousInstance";

export const Register = async (fullName, email, password) => {
    try {
        const response = await axiousInstance.post("/user/register", {
            fullName,
            email,
            password,
        });
        return response.data;
    }
    catch (error) {

        console.error("Registration error:", error.response?.data || error);
        throw error.response?.data || { message: "Registration failed." };

    }
}

export const Login = async (email, password) => {
    try {
        const response = await axiousInstance.post("/user/login", {
            email,
            password,
        });

        const { user } = response.data;

        localStorage.setItem('token', response.token);

        return { user, message: response.data.message };

    }
    catch (error) {
        console.error("Login error:", error.response?.data || error);
        throw error.response?.data || { message: "Login failed." };
    }
}

export const Logout = async () => {
    try {
        const response = await axiousInstance.get('/user/logout');
        localStorage.removeItem('token');
        return response.data;
    }
    catch (error) {

        console.error("Logout error:", error.response?.data || error);
        throw error.response?.data || { message: "Logout failed." };

    }
}

export const GetUserById = async () => {
    try {

        const response = await axiousInstance.get("/user/");
        return response.data;

    } catch (error) {
        console.error("Error fetching user by ID:", error.response?.data || error);
        throw error.response?.data || { message: "Failed to fetch user details." };
    }
}