import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import { CategoriesListResponse } from "../types/category";

export const categoryService = {
    getAllCategories: async (businessId?: string): Promise<CategoriesListResponse> => {
        const business_id = businessId || process.env.NEXT_PUBLIC_BUSINESS_ID;
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.ALL, {
            params: { business_id }
        });
        return response.data;
    }
};
