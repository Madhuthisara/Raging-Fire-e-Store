export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    isNew: boolean;
    sku: string;
    description: string;
    gallery: string[];
    colors: { name: string; image: string }[];
    sizes: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "OVERSIZED SHORT SLEEVE TEES",
        price: 2990,
        category: "T-Shirts",
        image: "/followingSection/image1.jpg",
        isNew: true,
        sku: "RF-2024-001",
        description: "Heavyweight cotton drop shoulder tee with premium screen print. Designed for an oversized fit and everyday comfort.",
        gallery: [
            "/followingSection/image1.jpg",
            "/followingSection/image2.png",
            "/followingSection/image3.jpg",
            "/followingSection/image4.jpg"
        ],
        colors: [
            { name: "Cream", image: "/followingSection/image1.jpg" },
            { name: "Black", image: "/followingSection/image2.png" }
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    { id: 2, name: "OVERSIZED BURNT GRAFFITI T-SHIRT", price: 2850, category: "T-Shirts", image: "/followingSection/image2.png", isNew: false, sku: "RF-2024-002", description: "Graffiti art inspired heavy cotton tee.", gallery: ["/followingSection/image2.png"], colors: [], sizes: ["S", "M", "L"] },
    { id: 3, name: "OVERSIZED BURNT MODERN T-SHIRT", price: 2950, category: "T-Shirts", image: "/followingSection/image3.jpg", isNew: true, sku: "RF-2024-003", description: "Modern aesthetic drop shoulder tee.", gallery: ["/followingSection/image3.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 4, name: "OVERSIZED MYTHICAL FLAMES T-SHIRT", price: 2750, category: "T-Shirts", image: "/followingSection/image4.jpg", isNew: false, sku: "RF-2024-004", description: "Mythical flames graphic tee.", gallery: ["/followingSection/image4.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 5, name: "OVERSIZED SPIRIT MASK T-SHIRT", price: 3050, category: "T-Shirts", image: "/followingSection/image5.jpg", isNew: true, sku: "RF-2024-005", description: "Traditional mask art graphic tee.", gallery: ["/followingSection/image5.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 6, name: "OVERSIZED DARK RITUAL T-SHIRT", price: 2900, category: "T-Shirts", image: "/followingSection/image6.jpg", isNew: false, sku: "RF-2024-006", description: "Dark ritual aesthetic tee.", gallery: ["/followingSection/image6.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 7, name: "OVERSIZED COBRA STRIKE T-SHIRT", price: 3150, category: "T-Shirts", image: "/followingSection/image7.jpg", isNew: true, sku: "RF-2024-007", description: "Cobra strike graphic tee.", gallery: ["/followingSection/image7.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 8, name: "OVERSIZED ANCIENT FIRE T-SHIRT", price: 2800, category: "T-Shirts", image: "/followingSection/image8.jpg", isNew: false, sku: "RF-2024-008", description: "Ancient fire symbolic tee.", gallery: ["/followingSection/image8.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 9, name: "OVERSIZED DEMON PRINT T-SHIRT", price: 3000, category: "T-Shirts", image: "/followingSection/image9.jpg", isNew: true, sku: "RF-2024-009", description: "Demon print graphic tee.", gallery: ["/followingSection/image9.jpg"], colors: [], sizes: ["S", "M", "L"] },
    { id: 10, name: "OVERSIZED RAGING BEAST T-SHIRT", price: 2950, category: "T-Shirts", image: "/followingSection/image10.jpg", isNew: false, sku: "RF-2024-010", description: "Raging beast graphic tee.", gallery: ["/followingSection/image10.jpg"], colors: [], sizes: ["S", "M", "L"] },
];
