'use client';
import React from 'react';
import Image from 'next/image';
import { Badge } from 'antd';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductProps {
    id: number | string;
    businessId: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
}

import Link from 'next/link';

const ProductCard = ({ id, businessId, name, price, image, category, isNew }: ProductProps) => {
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        addItem({
            productId: id,
            businessId,
            name,
            price,
            image,
            size: 'M', // default for now
            color: 'Original' // default for now
        });
        openCart();
    };

    return (
        <Link href={`/product/${id}`} className="group cursor-pointer block">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-sm">
                {isNew && (
                    <span className="absolute top-3 left-3 z-10 bg-primary text-bg-main text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        New Arrival
                    </span>
                )}

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-primary text-bg-main py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="mt-4 flex flex-col items-start">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary drop-shadow-sm mb-1">
                    {name}
                </h3>
                <p className="text-xs font-bold mb-1">
                    LKR {price.toLocaleString()}
                </p>
                <div className="text-[9px] text-text-muted uppercase tracking-widest flex flex-wrap gap-1 items-center font-semibold">
                    <span>or LKR {(price / 3).toLocaleString(undefined, { maximumFractionDigits: 0 })} x 3 with</span>
                    <span className="bg-blue-600 text-white px-1 py-[1px] rounded-[2px] font-bold">KOKO</span>
                    <span>/</span>
                    <span className="bg-[#00E5FF] text-black px-1 py-[1px] rounded-[2px] font-bold italic">mintpay</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;