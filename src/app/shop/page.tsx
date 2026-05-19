'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import BannerDivider from '@/components/BannerDivider';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import { Select, Tabs, Pagination } from 'antd';
import { SlidersHorizontal } from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category';



export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
    const [loading, setLoading] = useState(true);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('latest');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAllCategories();
                if (response.success && response.output) {
                    setCategories(response.output);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchAllCategoryProducts = async () => {
            if (selectedCategory !== 'all' || categories.length === 0) return;

            setSectionsLoading(true);
            try {
                const productPromises = categories.map(cat =>
                    productService.getAllProducts({
                        category_id: cat.id,
                        per_page: pageSize
                    })
                );

                const results = await Promise.all(productPromises);
                const newData: Record<string, Product[]> = {};

                results.forEach((res, index) => {
                    if (res.success && res.output) {
                        newData[categories[index].id] = Array.isArray(res.output) ? res.output : res.output.data;
                    }
                });

                setCategoryProducts(newData);
            } catch (error) {
                console.error('Failed to fetch category products:', error);
            } finally {
                setSectionsLoading(false);
            }
        };

        if (selectedCategory === 'all' && categories.length > 0) {
            fetchAllCategoryProducts();
        }
    }, [categories, selectedCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (selectedCategory === 'all') return;

            setLoading(true);
            try {
                const response = await productService.getAllProducts({
                    sort: sortBy,
                    category_id: selectedCategory,
                    page: currentPage,
                    per_page: pageSize
                });

                if (response.success && response.output) {
                    if (Array.isArray(response.output)) {
                        setProducts(response.output);
                        setTotalProducts(response.output.length);
                    } else {
                        setProducts(response.output.data);
                        setTotalProducts(response.output.total);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sortBy, selectedCategory, currentPage]);

    const handleCategoryChange = (key: string) => {
        setSelectedCategory(key);
        setCurrentPage(1);
    };

    return (
        <main className="bg-background">
            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-6 md:pb-10 border-b border-zinc-100 dark:border-zinc-800/50 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-[0.1em] text-primary transition-all">
                        {selectedCategory === 'all' ? 'ALL PRODUCTS' : categories.find(c => c.id === selectedCategory)?.name || 'PRODUCTS'}
                    </h1>
                    {!loading && (
                        <div className="flex items-center gap-2 mt-3 text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-black opacity-60">
                            <span className="w-8 h-[1px] bg-primary/20"></span>
                            {totalProducts} {totalProducts === 1 ? 'Product' : 'Items'} available
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="category-tabs flex-1">
                        <Tabs
                            activeKey={selectedCategory}
                            onChange={handleCategoryChange}
                            className="shop-tabs"
                            items={[
                                { key: 'all', label: 'ALL PRODUCTS' },
                                ...categories.map(cat => ({
                                    key: cat.id,
                                    label: cat.name.toUpperCase(),
                                }))
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto mb-4 md:mb-0">
                        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <SlidersHorizontal size={14} className="text-primary opacity-60" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sort By</span>
                            <Select
                                defaultValue="latest"
                                variant="borderless"
                                size='small'
                                className="w-40 sort-select"
                                onChange={(value) => setSortBy(value)}
                                options={[
                                    { value: 'latest', label: 'NEWEST ARRIVALS' },
                                    { value: 'price_asc', label: 'PRICE: LOW TO HIGH' },
                                    { value: 'price_desc', label: 'PRICE: HIGH TO LOW' },
                                    { value: 'name_asc', label: 'NAME: A-Z' },
                                    { value: 'name_desc', label: 'NAME: Z-A' },
                                ]}
                                classNames={{
                                    popup: { root: 'sort-dropdown' }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
                {selectedCategory === 'all' ? (
                    <div className="space-y-24">
                        {sectionsLoading && Object.keys(categoryProducts).length === 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex flex-col space-y-4">
                                        <div className="bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] rounded-sm"></div>
                                        <div className="space-y-2">
                                            <div className="h-2.5 md:h-3 bg-zinc-100 dark:bg-zinc-900 w-3/4 rounded-full"></div>
                                            <div className="h-2 md:h-2.5 bg-zinc-100 dark:bg-zinc-900 w-1/2 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : categories.map(cat => (
                            <div key={cat.id} className="space-y-8">
                                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                    <h2 className="text-xl md:text-2xl font-heading font-black uppercase tracking-widest text-primary">
                                        {cat.name}
                                    </h2>
                                    <button
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
                                    {categoryProducts[cat.id]?.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            businessId={product.business_id}
                                            name={product.name}
                                            price={parseFloat(product.base_price)}
                                            image={product.thumbnail_url || '/placeholder.jpg'}
                                            category={product.category?.name || cat.name}
                                            isNew={true}
                                        />
                                    ))}
                                    {(!categoryProducts[cat.id] || categoryProducts[cat.id].length === 0) && (
                                        <p className="col-span-full text-center py-10 text-text-muted text-xs uppercase tracking-widest opacity-40">
                                            No products available in this category
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex flex-col space-y-4">
                                        <div className="bg-zinc-100 dark:bg-zinc-900 aspect-[3/4] rounded-sm"></div>
                                        <div className="space-y-2">
                                            <div className="h-2.5 md:h-3 bg-zinc-100 dark:bg-zinc-900 w-3/4 rounded-full"></div>
                                            <div className="h-2 md:h-2.5 bg-zinc-100 dark:bg-zinc-900 w-1/2 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                <p className="text-text-muted uppercase tracking-[0.2em] text-[10px] md:text-xs font-black opacity-40">
                                    No Products Available Yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16 transition-opacity duration-500">
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

                        {totalProducts > pageSize && (
                            <div className="mt-16 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    total={totalProducts}
                                    pageSize={pageSize}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    className="shop-pagination"
                                />
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Banner Divider */}
            <BannerDivider />
        </main>
    );
}
