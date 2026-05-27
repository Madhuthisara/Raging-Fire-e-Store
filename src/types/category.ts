export interface Category {
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

import { PaginatedData } from './pagination';

export interface CategoriesListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Category>;
}
