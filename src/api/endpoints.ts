export const API_ENDPOINTS = {
    PRODUCTS: {
        ALL: '/products/all',
        BY_ID: (id: string) => `/products/${id}`,
        VARIANTS: (id: string) => `/products/${id}/variants`,
        REQUIRED_ATTRIBUTES: (id: string) => `/products/${id}/required-attributes`,
    },
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    CUSTOMER_AUTH: {
        LOGIN: '/customer/auth/login',
        REGISTER: '/customer/auth/register',
        PROFILE: '/customer/profile',
    },
    CUSTOMER_ORDERS: {
        CREATE: '/customer/orders',
        GET_ALL: '/customer/orders',
    },
    HEROES: '/heroes',
    PAYMENTS: {
        METHODS: (businessId: string) => `/payments/methods/${businessId}`,
        INITIATE: '/payments/initiate',
    },
};