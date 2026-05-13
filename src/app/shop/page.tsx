'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import BannerDivider from '@/components/BannerDivider';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';

export default function ShopPage() {
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

    return (
        <main className="bg-background">
            {/* Page Header */}
            <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
                <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-widest text-primary">
                    ALL PRODUCTS
                </h1>
                {!loading && (
                    <p className="text-xs text-text-muted uppercase tracking-widest mt-2 font-semibold">
                        {products.length} {products.length === 1 ? 'Product' : 'Products'}
                    </p>
                )}
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse flex flex-col space-y-4">
                                <div className="bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] rounded-sm"></div>
                                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 w-3/4 rounded-sm"></div>
                                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 w-1/2 rounded-sm"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-text-muted uppercase tracking-widest text-[10px] font-bold">
                            No Products Available Yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                businessId={product.business_id}
                                name={product.name}
                                price={parseFloat(product.base_price)}
                                image={product.thumbnail_url || '/placeholder.jpg'}
                                category={product.category?.name || 'Uncategorized'}
                                isNew={true}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Banner Divider */}
            <BannerDivider />
        </main>
    );
}
