import React from 'react';
import Image from 'next/image';

const FeaturedDrops = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-heading font-black uppercase tracking-widest mb-8 text-primary">
                FEATURED DROPS: STAND OUT
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
                {/* Left Large Image */}
                <div className="relative h-[400px] md:h-full bg-zinc-100 dark:bg-zinc-900 group overflow-hidden">
                    <Image
                        src="/temp/p1.jpg"
                        alt="Featured Layout 1"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Right Column */}
                <div className="grid grid-rows-2 gap-4 h-[600px] md:h-full">
                    {/* Top Right */}
                    <div className="relative bg-zinc-100 dark:bg-zinc-900 group overflow-hidden">
                        <Image
                            src="/temp/p3.jpg"
                            alt="Featured Layout 2"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Bottom Right Split */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative bg-zinc-100 dark:bg-zinc-900 group overflow-hidden">
                            <Image
                                src="/temp/p2.jpg"
                                alt="Featured Layout 3"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="relative bg-zinc-100 dark:bg-zinc-900 group overflow-hidden">
                            <Image
                                src="/temp/p4.jpg"
                                alt="Featured Layout 4"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDrops;
