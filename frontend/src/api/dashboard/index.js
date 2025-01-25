import { axiousInstance } from "../axiousInstance"

export const getDashboardData = async () => {
    try {

        const response = await axiousInstance.get('/user/dashboard');
        return response.data;
    }
    catch (error) {
        console.log(error)
    }

}