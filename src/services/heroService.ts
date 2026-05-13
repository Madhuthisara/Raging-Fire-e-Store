import { API_ENDPOINTS } from '../api/endpoints';

export interface HeroSection {
    id: number;
    title: string | null;
    description: string | null;
    image_path: string;
    button_text: string | null;
    button_link: string | null;
    order: number;
    is_active: boolean;
}

export const heroService = {
    getHeroes: async (): Promise<HeroSection[]> => {
        try {
            // Using absolute URL if needed, assuming NEXT_PUBLIC_API_URL is available
            // If not, use relative proxy path
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${baseUrl}${API_ENDPOINTS.HEROES}`, {
                next: { revalidate: 60 } // Cache for 60 seconds
            });

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch hero sections:', error);
            return [];
        }
    }
};
