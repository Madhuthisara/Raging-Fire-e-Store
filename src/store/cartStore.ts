import { create } from 'zustand';

export interface CartItem {
    id: string;         // unique key: productId + size + color
    productId: number | string;
    businessId: string;
    name: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
    attributeOptionIds?: string[];
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;

    // Derived (computed)
    totalItems: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),

    addItem: (item) => {
        const attrKey = item.attributeOptionIds ? item.attributeOptionIds.sort().join('-') : 'none';
        const id = `${item.productId}-${attrKey}`;
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
                ),
            }));
        } else {
            set((state) => ({
                items: [...state.items, { ...item, id, quantity: item.quantity ?? 1 }],
            }));
        }
    },

    removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

    updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
            get().removeItem(id);
            return;
        }
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
    },

    clearCart: () => set({ items: [] }),

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
