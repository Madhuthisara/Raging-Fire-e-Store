'use client';
import React from 'react';
import Link from 'next/link';
import { CONTACT_DETAILS } from '@/data/contact';

const Footer = () => {
    return (
        <footer className="w-full bg-background border-t border-zinc-200 dark:border-zinc-800 text-primary pt-16 mt-auto overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Left Column - Newsletter */}
                    <div className="md:col-span-5">
                        <Link href="/" className="text-3xl font-heading tracking-wider uppercase mb-6 block text-primary">
                            RAGING FIRE
                        </Link>
                        <p className="text-xs uppercase tracking-widest text-text-muted mb-6 leading-relaxed max-w-sm">
                            SUBSCRIBE TO OUR NEWSLETTER GET EARLY ACCESS TO NEW DROPS AND EXCLUSIVE DISCOUNTS.
                        </p>
                        <form className="flex w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className="flex-grow bg-transparent border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-xs uppercase tracking-widest focus:outline-none focus:border-primary dark:focus:border-white transition-colors text-primary"
                            />
                            <button type="submit" className="bg-primary text-background px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                                SUBSCRIBE
                            </button>
                        </form>
                        <p className="text-[10px] text-text-muted mt-8 uppercase tracking-widest">
                            © 2026, RAGING FIRE
                        </p>
                    </div>

                    {/* Middle Column - Contact */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary">CONTACT</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href={`tel:${CONTACT_DETAILS.phone.link}`} className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors block">
                                    {CONTACT_DETAILS.phone.display}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors block break-all">
                                    {CONTACT_DETAILS.email}
                                </a>
                            </li>
                            <li className="text-xs text-text-muted uppercase tracking-widest leading-relaxed">
                                {CONTACT_DETAILS.address.line1}<br />
                                {CONTACT_DETAILS.address.city}, {CONTACT_DETAILS.address.country}
                            </li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div className="md:col-span-2 md:col-start-9">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary">SUPPORT</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/returns" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    PAYMENT METHODS
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    TERMS & CONDITIONS
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    PRIVACY POLICY
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column - Social */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary">SOCIAL MEDIA</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href={CONTACT_DETAILS.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    INSTAGRAM
                                </a>
                            </li>
                            <li>
                                <a href={CONTACT_DETAILS.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    FACEBOOK
                                </a>
                            </li>
                            <li>
                                <a href={CONTACT_DETAILS.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-primary uppercase tracking-widest transition-colors">
                                    TIKTOK
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Giant Background Text Area */}
            <div className="w-full flex justify-center items-end opacity-[0.03] dark:opacity-5 pointer-events-none select-none mt-8 h-32 md:h-48 lg:h-64 overflow-hidden relative">
                <h1 className="text-[12vw] font-heading font-black uppercase leading-none text-primary whitespace-nowrap absolute bottom-[-10%]">
                    DESIGNED FOR THE BOLD.
                </h1>
            </div>
        </footer>
    );
};

export default Footer;
