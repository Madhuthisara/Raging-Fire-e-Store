"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { heroService, HeroSection } from '@/services/heroService';

const Hero = () => {
    const [heroes, setHeroes] = useState<HeroSection[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchHeroes = async () => {
            const data = await heroService.getHeroes();
            const activeHeroes = data.filter(h => h.is_active).sort((a, b) => a.order - b.order);
            setHeroes(activeHeroes);
        };
        fetchHeroes();
    }, []);

    useEffect(() => {
        if (heroes.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroes.length);
        }, 1000); // 5 seconds per slide

        return () => clearInterval(interval);
    }, [heroes.length]);

    if (heroes.length === 0) {
        // Fallback UI if no heroes are found
        return (
            <div className="relative bg-black text-white overflow-hidden min-h-[85vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10"></div>
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-50"></div>
                <div className="relative z-20 text-center">
                    <h1 className="text-6xl sm:text-8xl lg:text-9xl font-heading font-black uppercase tracking-widest leading-none drop-shadow-lg opacity-20">
                        E-STORE
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-black text-white overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
            {heroes.map((hero, index) => (
                <div
                    key={hero.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Very subtle bottom gradient only for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                        style={{
                            backgroundImage: `url(${hero.image_path})`,
                            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
                        }}
                    ></div>

                    <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-start justify-end h-full pb-16 sm:pb-20">
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-heading font-black uppercase tracking-tight leading-[0.9] mb-4 max-w-3xl drop-shadow-lg">
                            {hero.title}
                        </h1>

                        {hero.description && (
                            <p className="text-[11px] sm:text-base text-gray-200 max-w-2xl mb-6 uppercase tracking-[0.15em] leading-relaxed drop-shadow-md" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                {hero.description}
                            </p>
                        )}

                        {hero.button_text && hero.button_link && (
                            <Link href={hero.button_link} className="inline-flex justify-center items-center px-8 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors duration-300">
                                {hero.button_text}
                            </Link>
                        )}

                        {/* Progress bar indicator */}
                        {heroes.length > 1 && (
                            <div className="mt-8 flex items-center gap-1.5">
                                {heroes.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-[2px] rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-white' : 'w-5 bg-white/30 hover:bg-white/50'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Hero;
