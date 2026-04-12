import Navbar from '@/components/Navbar';
import ParticleCanvas from '@/components/ParticleCanvas';
import Hero from '@/components/Hero';
import Bestsellers from '@/components/Bestsellers';
import Products from '@/components/Products';
import Podcasts from '@/components/Podcasts';
import Celebrities from '@/components/Celebrities';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Team from '@/components/Team';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Loader, ProgressBar, ScrollToTop } from '@/components/Utils';

export default function Home({ cms, bestsellers, products, videos, celebrities }) {
    return (
        <>
            <Loader />
            <ProgressBar />
            <div className="bg-animation" />
            <ParticleCanvas />
            <Navbar />
            <main>
                <Hero cms={cms?.hero} />
                <Bestsellers products={bestsellers} />
                <Products products={products} />
                <Podcasts videos={videos} />
                <Celebrities celebrities={celebrities} />
                <Features cms={cms?.features} />
                <Pricing cms={cms?.pricing} />
                <Team cms={cms?.team} />
                <Contact cms={cms?.contact} />
            </main>
            <Footer cms={cms?.footer} />
            <ScrollToTop />
        </>
    );
}
