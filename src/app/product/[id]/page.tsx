'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import BannerDivider from '@/components/BannerDivider';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';

// Related products mock data

// Related products will be fetched dynamically

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const { addItem, openCart } = useCartStore();
    const router = useRouter();

    // Fetch Product Details
    const { data: productResponse, isLoading: productLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id),
    });

    // Fetch Required Attributes
    const { data: attributesResponse, isLoading: attributesLoading } = useQuery({
        queryKey: ['attributes', id],
        queryFn: () => productService.getRequiredAttributes(id),
    });

    // Fetch Variants (for stock check)
    const { data: variantsResponse } = useQuery({
        queryKey: ['variants', id],
        queryFn: () => productService.getVariants(id),
    });

    // Fetch All Products for "Related Products"
    const { data: allProductsResponse } = useQuery({
        queryKey: ['all-products'],
        queryFn: () => productService.getAllProducts(),
    });

    const product = productResponse?.output;
    const allAttributes = attributesResponse?.output || [];
    const variants = variantsResponse?.output || [];

    // Filter related products
    const allProducts = allProductsResponse?.output;
    const productsArray = Array.isArray(allProducts) ? allProducts : allProducts?.data || [];

    const relatedProducts = productsArray
        ?.filter((p: Product) => p.id !== id)
        ?.slice(0, 3) || [];

    // Filter attributes to only show customer-relevant ones
    const filteredAttributes = allAttributes.filter((attr: any) => {
        const name = attr.name.toLowerCase();
        return !name.includes('design') && !name.includes('placement') && !name.includes('logo');
    });

    const handleAttributeSelect = (attributeId: string, optionId: string) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attributeId]: optionId
        }));
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Ensure all filtered attributes are selected
        if (Object.keys(selectedAttributes).length < filteredAttributes.length) {
            alert("Please select all options");
            return;
        }

        addItem({
            productId: product.id,
            businessId: product.business_id,
            name: product.name,
            price: parseFloat(product.base_price),
            image: product.thumbnail_url || product.images?.[0]?.image_url || "/followingSection/image1.jpg",
            attributeOptionIds: Object.values(selectedAttributes),
            size: Object.values(selectedAttributes).join(' / '), // Simple join for display
            color: "" // No longer needed as separate string
        });
        openCart();
    };

    const handleBuyNow = () => {
        handleAddToCart();
        if (Object.keys(selectedAttributes).length === filteredAttributes.length) {
            router.push('/checkout');
        }
    };

    if (productLoading || attributesLoading) {
        return <div className="flex justify-center items-center h-screen">Loading product...</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found.</div>;
    }

    const displayImages = product.images?.map(img => img.image_url) || [product.thumbnail_url].filter(Boolean) as string[];
    if (displayImages.length === 0) displayImages.push("/followingSection/image1.jpg");

    return (
        <main className="bg-background">
            {/* Product Details Section */}
            <section className="max-w-7xl mx-auto px-6 pt-8 pb-16">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-3/5 grid grid-cols-2 gap-4">
                        {displayImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-sm overflow-hidden">
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full md:w-2/5 flex flex-col pt-4 md:pt-0">
                        <h1 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-widest text-primary mb-2">
                            {product.name}
                        </h1>
                        <p className="text-sm text-text-muted mb-1">
                            {product.description || "Premium Quality DTF Printed Tee"}
                        </p>
                        <p className="text-sm text-text-muted mb-6">
                            SKU: {product.sku}
                        </p>

                        <div className="mb-2">
                            <span className="text-xl font-bold uppercase tracking-widest text-primary">
                                LKR {parseFloat(product.base_price).toLocaleString()}
                            </span>
                        </div>

                        <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest flex flex-wrap gap-1 md:gap-2 items-center font-semibold mb-8">
                            <span>or pay LKR {(parseFloat(product.base_price) / 3).toLocaleString(undefined, { maximumFractionDigits: 2 })} x 3 with</span>
                            <span className="bg-blue-600 text-white px-2 py-[2px] rounded-[2px] font-bold">KOKO</span>
                            <span>/</span>
                            <span className="bg-[#00E5FF] text-black px-2 py-[2px] rounded-[2px] font-bold italic">mintpay</span>
                        </div>

                        {/* Dynamic Attributes (Size, Color, etc.) */}
                        {filteredAttributes.map((attr: any) => (
                            <div key={attr.attribute_id} className="mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                                    AVAILABLE {attr.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {attr.options.map((opt: any) => (
                                        <button
                                            key={opt.option_id}
                                            onClick={() => handleAttributeSelect(attr.attribute_id, opt.option_id)}
                                            className={`min-w-12 h-12 px-4 flex items-center justify-center text-xs font-bold border transition-colors
                                                ${selectedAttributes[attr.attribute_id] === opt.option_id
                                                    ? 'border-primary bg-primary text-bg-main'
                                                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 text-primary'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {!filteredAttributes.length && (
                            <p className="text-xs text-text-muted italic mb-6">Standard One-Size</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-zinc-900 border border-zinc-900 text-white dark:bg-white dark:border-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                ADD TO CARD
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-transparent border border-zinc-900 text-zinc-900 dark:border-white dark:text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* You May Also Like Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <h2 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-widest text-primary mb-8">
                    YOU MAY ALSO LIKE
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedProducts.map((p: Product) => (
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            businessId={p.business_id}
                            name={p.name}
                            price={parseFloat(p.base_price)}
                            image={p.thumbnail_url || "/followingSection/image1.jpg"}
                            category="NEW DROP"
                            isNew={true}
                        />
                    ))}
                </div>
            </section>

            {/* Banner Divider */}
            <BannerDivider />
        </main>
    );
}
