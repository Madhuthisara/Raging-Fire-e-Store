'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="bg-background min-h-[70vh] flex items-center justify-center px-6 py-20">
            <div className="max-w-xl w-full text-center space-y-8">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle2 size={48} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-widest text-primary">
                        Order Received!
                    </h1>
                    <p className="text-text-muted text-sm uppercase tracking-widest font-bold max-w-sm mx-auto">
                        Thank you for shopping with us. Your order has been placed successfully via Cash on Delivery.
                    </p>
                </div>

                {/* Steps/Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-y border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center gap-3">
                        <Package size={24} className="text-primary opacity-60" />
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Processing</h3>
                            <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">1-2 Business Days</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Truck size={24} className="text-primary opacity-60" />
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Delivery</h3>
                            <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">2-4 Business Days</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        href="/shop"
                        className="flex-1 bg-primary text-background py-4 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Continue Shopping <ArrowRight size={14} />
                    </Link>
                    <Link
                        href="/profile"
                        className="flex-1 border border-zinc-300 dark:border-zinc-700 text-primary py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        View Order Status
                    </Link>
                </div>

                <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold pt-4">
                    A confirmation email will be sent to your registered email address shortly.
                </p>
            </div>
        </main>
    );
}
