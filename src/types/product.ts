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

export interface ProductsListResponse {
    success: boolean;
    message: string;
    output: {
        current_page: number;
        data: Product[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    } | Product[];
}

export interface ProductResponse {
    success: boolean;
    message: string;
    output: Product;
}
