'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { customerAuthService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const { message: messageApi } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await customerAuthService.login(formData);

            if (response.success) {
                messageApi.success("Login successful!");
                setAuth(response.output.customer, response.output.access_token);
                router.push('/');
            } else {
                messageApi.error(response.message || "Login failed");
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            messageApi.error(error.response?.data?.message || "Invalid email or password");
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
                        Sign In To Your Account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-[10px] uppercase tracking-widest">
                            <a href="#" className="font-bold text-text-muted hover:text-primary transition-colors">
                                Forgot password?
                            </a>
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="text-center mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">
                            New to Raging Fire?
                        </p>
                        <Link
                            href="/register"
                            className="mt-4 group relative w-full flex justify-center py-3 px-4 border border-black dark:border-white text-xs font-black uppercase tracking-[0.2em] text-primary bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <UserPlus className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </span>
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
