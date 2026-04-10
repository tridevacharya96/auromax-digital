import Navbar from '@/components/Navbar';
import ParticleCanvas from '@/components/ParticleCanvas';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Team from '@/components/Team';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Loader, ProgressBar, ScrollToTop } from '@/components/Utils';

export default function Home() {
    return (
        <>
            <Loader />
            <ProgressBar />
            <div className="bg-animation" />
            <ParticleCanvas />
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Pricing />
                <Team />
                <Contact />
            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
