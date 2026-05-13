export interface Attribute {
    attribute_id: string;
    business_id: string;
    name: string;
    options?: AttributeOption[];
}

export interface AttributeOption {
    option_id: string;
    attribute_id: string;
    name: string;
    code: string;
    description?: string;
}

export interface RequiredAttributesResponse {
    success: boolean;
    message: string;
    output: {
        attribute_id: string;
        name: string;
        options: {
            option_id: string;
            name: string;
        }[];
    }[];
}

export interface ProductVariant {
    id: string;
    product_id: string;
    batch_id: string | null;
    quantity: number;
    reorder_level: number;
    attribute_options: any[];
}

export interface ProductVariantsResponse {
    success: boolean;
    message: string;
    output: ProductVariant[];
}
