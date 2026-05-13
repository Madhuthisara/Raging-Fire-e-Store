import React from 'react';

const BannerDivider = () => {
    return (
        <section className="w-full relative h-[40vh] md:h-[50vh] bg-zinc-900 overflow-hidden mb-16">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('/followingSection/image7.jpg')] bg-cover bg-center opacity-70"></div>

            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Content Left Aligned */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
                <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-widest text-white leading-none drop-shadow-lg max-w-md">
                    MOVE <br />
                    YOUR WAY.
                </h2>
            </div>
        </section>
    );
};

export default BannerDivider;
