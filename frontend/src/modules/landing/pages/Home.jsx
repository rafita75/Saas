import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Modules } from '../components/Modules';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { LaunchBanner } from '../../../shared/components/LaunchBanner';
/* import { Pricing } from '../components/Pricing' */

export const Home = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Modules />
        <Testimonials />{/* 
        <Pricing/> */}
      </main>
      <Footer />
      <WhatsAppButton />
      <LaunchBanner />
    </div>
  );
};