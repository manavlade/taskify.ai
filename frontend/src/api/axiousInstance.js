import axios from "axios";

const baseURL = import.meta.env.USER_API_END_POINT_USER ||  "http://localhost:8000/api/v1/user";

export const axiousInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

axiousInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)
