'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Minus, Plus, X } from 'lucide-react';
import { Drawer, Button, ConfigProvider, theme } from 'antd'; // antd components
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

const CartDrawer = () => {
    const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCartStore();
    const router = useRouter();

    // Antd theme tokens check karanawa dark mode ekata
    const { token } = theme.useToken();

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between uppercase tracking-widest font-black text-foreground">
                    <span>My CART</span>
                    <div className="relative">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {totalItems()}
                        </span>
                    </div>
                </div>
            }
            placement="right"
            onClose={closeCart}
            open={isOpen}
            size="default"
            closeIcon={<X size={20} className="text-foreground hover:opacity-70" />}
            styles={{
                body: { paddingBottom: 80, backgroundColor: 'var(--background)', color: 'var(--foreground)' },
                mask: { backdropFilter: 'blur(4px)' },
                header: { backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border-color, #27272a)' },
                section: { backgroundColor: 'var(--background)', color: 'var(--foreground)' }
            }}
            footer={
                items.length > 0 && (
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-background">
                        <div className="flex justify-between mb-4 text-foreground">
                            <span className="font-bold uppercase text-xs tracking-widest">Sub Total</span>
                            <span className="font-black text-xl">RS.{subtotal().toLocaleString()}</span>
                        </div>
                        <Button
                            type="primary"
                            block
                            size="large"
                            className="bg-black dark:bg-white text-white dark:text-black h-12 font-bold tracking-widest border-none hover:opacity-90 mt-4"
                            onClick={() => {
                                closeCart();
                                router.push('/checkout');
                            }}
                        >
                            PROCEED TO CHECKOUT
                        </Button>
                    </div>
                )
            }
        >
            <div className="space-y-6">
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-widest">Your cart is empty</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800 last:border-0 relative">
                            <div className="relative w-20 h-24 flex-shrink-0 bg-zinc-100 dark:bg-zinc-900">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1 text-foreground">{item.name}</h3>
                                <p className="text-sm font-bold mb-3 text-foreground">Rs. {item.price.toLocaleString()}</p>

                                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 w-fit bg-transparent">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors"><Minus size={12} /></button>
                                    <span className="px-3 text-xs font-bold text-foreground">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors"><Plus size={12} /></button>
                                </div>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="absolute right-0 top-0 text-zinc-400 hover:text-foreground transition-colors">
                                <X size={16} strokeWidth={2} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </Drawer>
    );
};

export default CartDrawer;