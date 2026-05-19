'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Sun, Moon, User as UserIcon, Menu as MenuIcon, X, LogOut, ChevronDown, Package, Heart, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge, Dropdown, MenuProps, Drawer, Divider } from 'antd';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { openCart, totalItems } = useCartStore();
    const { customer, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const accountMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: <Link href="/profile">My Profile</Link>,
            icon: <UserIcon size={14} />,
        },
        {
            key: 'orders',
            label: <Link href="/profile/orders">My Orders</Link>,
            icon: <Package size={14} />,
        },
        {
            key: 'wishlist',
            label: <Link href="/wishlist">Wishlist</Link>,
            icon: <Heart size={14} />,
        },
        {
            key: 'divider',
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            danger: true,
            icon: <LogOut size={14} />,
            onClick: handleLogout,
        },
    ];

    const navLinks = [
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    if (!mounted) return null;

    return (
        <nav className={`w-full z-50 transition-all duration-300 ${scrolled ? 'sticky top-0 bg-background/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm' : 'relative bg-background'}`}>
            {/* 1. Top Announcement Bar */}
            {!scrolled && (
                <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 py-2 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="text-[9px] font-black tracking-[0.25em] uppercase flex gap-12 items-center text-primary opacity-60 px-6">
                                <span>Free Returns Within 7 Days</span>
                                <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                                <span>Free Fast Delivery On Orders Over LKR 10,000</span>
                                <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                                <span>Official Raging Fire Store</span>
                                <span className="w-1 h-1 rounded-full bg-primary/20"></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">

                    {/* Left: Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-primary opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <MenuIcon size={22} />
                        </button>
                    </div>

                    {/* Center: Logo Section */}
                    <div className="flex-shrink-0 flex items-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        <Link href="/" className="flex items-center group">
                            {resolvedTheme === 'dark' ? (
                                <img src="/Logo_White.png" alt="Raging Fire Logo" className="h-[18px]  md:h-[20px] lg:h-[22px] w-auto transition-transform group-hover:scale-105" />
                            ) : (
                                <img src="/Logo_Black.png" alt="Raging Fire Logo" className="h-[18px]  md:h-[20px] lg:h-[22px] w-auto transition-transform group-hover:scale-105" />
                            )}
                        </Link>
                    </div>

                    {/* Center Links (Desktop) */}
                    <div className="hidden md:flex space-x-10 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs font-black uppercase tracking-[0.2em] text-foreground opacity-60 hover:opacity-100 transition-all hover:translate-y-[-1px] active:translate-y-0"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-1 md:space-x-5 text-foreground">
                        {/* Search Icon (Desktop) */}
                        <button className="hidden sm:block opacity-60 hover:opacity-100 transition-opacity p-2">
                            <Search size={18} strokeWidth={2.5} />
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="opacity-60 hover:opacity-100 transition-opacity p-2 hidden sm:block"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                        </button>

                        {/* Account Section */}
                        {isAuthenticated && customer ? (
                            <div className="flex items-center">
                                <Dropdown menu={{ items: accountMenuItems }} placement="bottomRight" arrow>
                                    <button className="flex items-center gap-2 group p-2 opacity-60 hover:opacity-100 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                            <UserIcon size={16} strokeWidth={2.5} />
                                        </div>
                                        <span className="hidden lg:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest pt-0.5">
                                            {customer.first_name}
                                            <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
                                        </span>
                                    </button>
                                </Dropdown>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="opacity-60 hover:opacity-100 transition-opacity p-2 flex items-center gap-2 group"
                            >
                                <UserIcon size={18} strokeWidth={2.5} />
                                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest pt-0.5">
                                    Account
                                </span>
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Badge
                            count={totalItems()}
                            showZero
                            size="medium"
                            offset={[0, 0]}
                            className="cart-badge"
                        >
                            <button
                                onClick={openCart}
                                className="text-foreground p-2.5 rounded-full flex items-center justify-center group hover:scale-110 active:scale-95 transition-all"
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} />
                            </button>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                size={300}
                className="dark:!bg-zinc-950"
                styles={{
                    body: { padding: 0 }
                }}
                closeIcon={null}
            >
                <div className="p-6 flex flex-col h-full bg-background dark:bg-zinc-950">
                    <div className="flex items-center justify-between mb-10">
                        <img
                            src={resolvedTheme === 'dark' ? "/Logo_White.png" : "/Logo_Black.png"}
                            alt="Logo"
                            className="h-[20px] w-auto"
                        />
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 opacity-60 hover:opacity-100">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-black uppercase tracking-[0.25em] text-primary hover:pl-2 transition-all border-l-2 border-transparent hover:border-primary pl-0"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <Divider className="my-8" />

                    <div className="mt-auto space-y-4 pb-6">
                        <button
                            onClick={() => {
                                setTheme(theme === 'dark' ? 'light' : 'dark');
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-xs font-bold uppercase tracking-widest"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>

                        <Link
                            href="/search"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-xs font-bold uppercase tracking-widest"
                        >
                            <Search size={16} />
                            Search Products
                        </Link>
                    </div>
                </div>
            </Drawer>
        </nav>
    );
};

export default Navbar;