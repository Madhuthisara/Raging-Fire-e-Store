'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, ArrowRight, Lock } from 'lucide-react';
import { customerAuthService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '', // Add password state
        confirmPassword: '' // Filter confirms
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const data = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                mobile_number: formData.phone,
                address: formData.address,
                password: formData.password,
            };

            const response = await customerAuthService.register(data);

            if (response.success) {
                message.success("Registration successful!");
                setAuth(response.output.customer, response.output.access_token);
                router.push('/');
            } else {
                message.error(response.message || "Registration failed");
            }
        } catch (error: any) {
            console.error('Registration Error:', error);
            message.error(error.response?.data?.message || "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 p-10 bg-zinc-50 dark:bg-zinc-900 shadow-2xl rounded-sm border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
                <div className="text-center">
                    <h1 className="text-3xl font-heading font-black tracking-widest text-primary uppercase">
                        RAGING FIRE
                    </h1>
                    <h2 className="mt-4 text-xs font-bold tracking-[0.3em] text-text-muted uppercase">
                        Create Your Account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                    <User size={14} strokeWidth={2.5} />
                                </span>
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                    <User size={14} strokeWidth={2.5} />
                                </span>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                <Mail size={14} strokeWidth={2.5} />
                            </span>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                <Phone size={14} strokeWidth={2.5} />
                            </span>
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute top-3 left-3 flex items-center pointer-events-none text-text-muted">
                                <MapPin size={14} strokeWidth={2.5} />
                            </span>
                            <textarea
                                name="address"
                                required
                                rows={3}
                                className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors resize-none"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                <Lock size={14} strokeWidth={2.5} />
                            </span>
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                <Lock size={14} strokeWidth={2.5} />
                            </span>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-700 bg-background text-primary placeholder-zinc-400 dark:placeholder-zinc-600 rounded-sm text-xs tracking-widest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-black uppercase tracking-[0.2em] text-white dark:text-black bg-black dark:bg-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg disabled:opacity-50"
                        >
                            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200 dark:group-hover:text-zinc-800 transition-colors" />
                            </span>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-primary hover:underline transition-all">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
