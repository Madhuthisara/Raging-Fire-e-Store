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
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-sm group/image shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                {isNew && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-primary text-background text-[8px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 uppercase tracking-[0.2em]">
                        New
                    </span>
                )}

                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Quick Add Overlay (Desktop) */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-end p-4">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-primary text-background py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                        <ShoppingCart size={14} />
                        Quick Add
                    </button>
                </div>

                {/* Mobile Add to Cart Trigger */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-2 right-2 md:hidden z-10 bg-primary text-background p-2 rounded-full shadow-lg shadow-black/20"
                >
                    <ShoppingCart size={16} />
                </button>
            </div>

            <div className="mt-3 md:mt-4 flex flex-col items-start w-full px-1">
                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-primary truncate w-full mb-1">
                    {name}
                </h3>
                <p className="text-[11px] md:text-sm font-black mb-2 flex items-center gap-2">
                    <span className="text-primary/60 text-[9px] font-bold">LKR</span>
                    {price.toLocaleString()}
                </p>

                {/* Installment Row */}
                <div className="text-[8px] md:text-[9px] text-text-muted uppercase tracking-[0.15em] flex flex-wrap gap-x-1.5 gap-y-2 items-center font-bold border-t border-zinc-100 dark:border-zinc-800/50 pt-2 w-full">
                    <span className="opacity-60">Split in 3 with</span>
                    <div className="flex items-center gap-1.5">
                        <span className="bg-blue-600 text-white px-1 py-[1px] md:py-[2px] rounded-[2px] font-black text-[7px] md:text-[8px]">KOKO</span>
                        <span className="opacity-40">/</span>
                        <span className="bg-[#00E5FF] text-black px-1 py-[1px] md:py-[2px] rounded-[2px] font-black italic text-[7px] md:text-[8px]">mintpay</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;