
import Hero from '@/components/Hero';
import NewDrops from '@/components/NewDrops';
import FeaturedDrops from '@/components/FeaturedDrops';
import InstagramFeed from '@/components/InstagramFeed';
import BannerDivider from '@/components/BannerDivider';

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="bg-background max-w-[100vw]">
        <div className="max-w-7xl mx-auto px-6 py-20 pb-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-heading font-black uppercase tracking-widest text-primary">
              NEW DROPS
            </h2>
            <button className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity">
              View All
            </button>
          </div>

          <NewDrops />
        </div>
      </section>

      <FeaturedDrops />
      <InstagramFeed />
      <BannerDivider />
    </main>
  );
}