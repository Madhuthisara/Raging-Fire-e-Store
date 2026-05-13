'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';

const NewDrops = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                if (response.success && response.output) {
                    setProducts(response.output);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col space-y-4">
                        <div className="bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] rounded-sm"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 w-3/4 rounded-sm"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 w-1/2 rounded-sm"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-text-muted uppercase tracking-widest text-[10px] font-bold">
                    New Collection Coming Soon
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    businessId={product.business_id}
                    name={product.name}
                    price={parseFloat(product.base_price)}
                    image={product.thumbnail_url || '/placeholder.jpg'}
                    category="NEW DROP"
                    isNew={true}
                />
            ))}
        </div>
    );
};

export default NewDrops;
