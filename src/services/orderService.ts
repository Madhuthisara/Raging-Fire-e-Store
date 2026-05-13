import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";

export const orderService = {
    placeOrder: async (data: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER_ORDERS.CREATE, data);
        return response.data;
    },

    getCustomerOrders: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER_ORDERS.GET_ALL);
        return response.data;
    },
};
