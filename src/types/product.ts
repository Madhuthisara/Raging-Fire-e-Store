export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
}

export interface Product {
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    sku: string;
    base_price: string;
    discount: string;
    thumbnail_url: string | null;
    category?: { name: string } | null;
    created_at: string;
    images?: ProductImage[];
}

import { PaginatedData } from './pagination';

export interface ProductsListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Product>;
}

export interface ProductResponse {
    success: boolean;
    message: string;
    output: Product;
}
