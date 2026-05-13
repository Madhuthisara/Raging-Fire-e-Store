'use client';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Award, Percent } from 'lucide-react';

const ProfilePage = () => {
    const { customer, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!customer) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 mb-8 text-center sm:text-left sm:flex sm:items-center sm:gap-8">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4 sm:mb-0">
                        <User size={48} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-widest text-primary">
                            {customer.first_name} {customer.last_name}
                        </h1>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mt-1">
                            Valued Customer
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                            <span className="w-4 h-px bg-primary"></span>
                            Contact Information
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail size={16} className="text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Email</p>
                                    <p className="text-sm font-medium text-primary">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone size={16} className="text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Phone</p>
                                    <p className="text-sm font-medium text-primary">{customer.mobile_number}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin size={16} className="text-zinc-400 mt-1" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Address</p>
                                    <p className="text-sm font-medium text-primary leading-relaxed">
                                        {customer.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loyalty & Rewards */}
                    <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                            <span className="w-4 h-px bg-primary"></span>
                            Loyalty & Rewards
                        </h2>
                        <div className="space-y-8">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 mb-4 text-zinc-400">
                                    <Award size={20} />
                                    <p className="text-[10px] uppercase tracking-widest font-bold">Loyalty Points</p>
                                </div>
                                <p className="text-4xl font-black text-primary">
                                    {customer.loyalty_points}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">
                                    Points earned from your purchases
                                </p>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3 mb-4 text-zinc-400">
                                    <Percent size={20} />
                                    <p className="text-[10px] uppercase tracking-widest font-bold">Standard Discount</p>
                                </div>
                                <p className="text-4xl font-black text-primary">
                                    {customer.discount_percentage}%
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">
                                    Tier-based discount active on your account
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
