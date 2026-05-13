import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    address: string;
    loyalty_points: number;
    discount_percentage: number;
}

interface AuthState {
    customer: Customer | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (customer: Customer, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            customer: null,
            token: null,
            isAuthenticated: false,
            setAuth: (customer, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', token);
                }
                set({ customer, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                }
                set({ customer: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'customer-auth-storage',
        }
    )
);
