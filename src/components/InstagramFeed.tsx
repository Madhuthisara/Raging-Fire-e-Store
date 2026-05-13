'use client';

import React from 'react';
import Image from 'next/image';

const InstagramFeed = () => {
    const feed = [
        { id: 1, image: '/followingSection/image1.jpg' },
        { id: 2, image: '/followingSection/image2.png' },
        { id: 3, image: '/followingSection/image3.jpg' },
        { id: 4, image: '/followingSection/image4.jpg' },
        { id: 5, image: '/followingSection/image5.jpg' },
        { id: 6, image: '/followingSection/image6.jpg' },
        { id: 7, image: '/followingSection/image7.jpg' },
        { id: 8, image: '/followingSection/image8.jpg' },
        { id: 9, image: '/followingSection/image9.jpg' },
        { id: 10, image: '/followingSection/image10.jpg' },
    ];

    // Duplicate the array to create seamless loop
    const duplicatedFeed = [...feed, ...feed];

    return (
        <section className="py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <h2 className="text-3xl font-heading font-black uppercase tracking-widest text-primary">
                    FOLLOW RAGING FIRE
                </h2>
            </div>

            {/* Scrolling marquee container */}
            <div className="relative w-full overflow-hidden group">
                <div
                    className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused]"
                    style={{ width: 'max-content' }}
                >
                    {duplicatedFeed.map((item, idx) => (
                        <a
                            key={`${item.id}-${idx}`}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex-shrink-0 w-[280px] sm:w-[320px] aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900 group/card"
                        >
                            <Image
                                src={item.image}
                                alt={`Instagram post ${item.id}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-heading text-2xl tracking-widest uppercase">
                                    Raging Fire
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
