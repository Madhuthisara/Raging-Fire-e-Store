import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";

export const paymentService = {
    getActiveMethods: async (businessId: string) => {
        const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.METHODS(businessId));
        return response.data;
    },

    initiatePayment: async (data: {
        business_id: string;
        gateway_name: string;
        amount: number;
        currency: string;
        order_id: string;
        return_url: string;
        cancel_url: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        district?: string;
        postal_code?: string;
        country?: string;
        items_description?: string;
    }) => {
        const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.INITIATE, data);
        return response.data;
    }
};
