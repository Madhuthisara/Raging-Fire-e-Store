'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge, Dropdown, MenuProps } from 'antd';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { openCart, totalItems } = useCartStore();
    const { customer, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="w-full bg-background transition-colors duration-300">
            {/* 1. Top Announcement Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 py-2.5 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex animate-marquee whitespace-nowrap">
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase flex gap-12 items-center text-primary opacity-80 px-6">
                        <span>Free Returns Within 7 Days</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Fast Delivery On Orders Over LKR 10,000</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Official Raging Fire Store</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Returns Within 7 Days</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Fast Delivery On Orders Over LKR 10,000</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Official Raging Fire Store</span>
                    </div>
                    {/* Repeated for seamless scroll */}
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase flex gap-12 items-center text-primary opacity-80 px-6">
                        <span>Free Returns Within 7 Days</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Fast Delivery On Orders Over LKR 10,000</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Official Raging Fire Store</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Returns Within 7 Days</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Free Fast Delivery On Orders Over LKR 10,000</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                        <span>Official Raging Fire Store</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 border-b border-zinc-100 dark:border-zinc-800">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center">
                            {mounted && resolvedTheme === 'dark' ? (
                                <img src="/Logo_White.png" alt="Raging Fire Logo" className="h-[40px] md:h-[25px] w-auto" />
                            ) : (
                                <img src="/Logo_Black.png" alt="Raging Fire Logo" className="h-[40px] md:h-[25px] w-auto" />
                            )}
                        </Link>
                    </div>

                    {/* Center Links (Desktop) */}
                    <div className="hidden md:flex space-x-12 items-center">
                        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-foreground opacity-70 hover:opacity-100 transition-opacity">
                            Shop
                        </Link>
                        <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-foreground opacity-70 hover:opacity-100 transition-opacity">
                            Contact
                        </Link>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4 text-foreground">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="opacity-70 hover:opacity-100 transition-opacity p-1"
                            aria-label="Toggle Theme"
                        >
                            {mounted ? (theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />) : <div style={{ width: 18, height: 18 }}></div>}
                        </button>

                        {/* Login/Register or Account Icon */}
                        {mounted && isAuthenticated && customer ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="opacity-70 hover:opacity-100 transition-opacity p-1 flex items-center gap-1.5 group"
                                    title="My Profile"
                                >
                                    <UserIcon size={18} strokeWidth={2.5} />
                                    <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest pt-0.5 max-w-[80px] truncate">
                                        Hi, {customer.first_name}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                    className="opacity-70 hover:opacity-100 transition-opacity p-1 flex items-center gap-1.5 group border-l border-zinc-200 dark:border-zinc-700 pl-4"
                                    title="Logout"
                                >
                                    <LogOut size={16} strokeWidth={2.5} className="text-red-500" />
                                    <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest pt-0.5">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="opacity-70 hover:opacity-100 transition-opacity p-1 flex items-center gap-1.5 group"
                                title="Login / Register"
                            >
                                <UserIcon size={18} strokeWidth={2.5} />
                                <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest pt-0.5">
                                    Account
                                </span>
                            </Link>
                        )}

                        {/* Search Icon */}
                        <button className="opacity-70 hover:opacity-100 transition-opacity p-1">
                            <Search size={18} strokeWidth={2.5} />
                        </button>

                        {/* Cart Icon */}
                        <button
                            onClick={openCart}
                            className="opacity-70 hover:opacity-100 transition-opacity relative p-1 flex items-center space-x-1 border-l border-zinc-200 dark:border-zinc-700 pl-4"
                        >
                            <span className="text-xs font-bold mr-1">{mounted ? totalItems() : 0}</span>
                            <ShoppingBag size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;