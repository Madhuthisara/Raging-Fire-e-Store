import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";

export const customerAuthService = {
    register: async (data: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER_AUTH.REGISTER, data);
        return response.data;
    },

    login: async (credentials: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER_AUTH.LOGIN, credentials);
        return response.data;
    },

    getProfile: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER_AUTH.PROFILE);
        return response.data;
    },
};
