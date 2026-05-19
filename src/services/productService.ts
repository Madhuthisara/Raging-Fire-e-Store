import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import { ProductResponse, ProductsListResponse } from '../types/product';
import { RequiredAttributesResponse, ProductVariantsResponse } from '../types/attribute';

export const productService = {
    getAllProducts: async (params?: {
        sort?: string;
        category_id?: string;
        page?: number;
        per_page?: number;
        business_id?: string;
    }): Promise<ProductsListResponse> => {
        const business_id = params?.business_id || process.env.NEXT_PUBLIC_BUSINESS_ID;
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ALL, {
            params: { ...params, business_id }
        });
        return response.data;
    },

    getProductById: async (id: string, config?: AxiosRequestConfig): Promise<ProductResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BY_ID(id), config);
        return response.data;
    },

    getRequiredAttributes: async (id: string, config?: AxiosRequestConfig): Promise<RequiredAttributesResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.REQUIRED_ATTRIBUTES(id), config);
        return response.data;
    },

    getVariants: async (id: string, config?: AxiosRequestConfig): Promise<ProductVariantsResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.VARIANTS(id), config);
        return response.data;
    },
};
