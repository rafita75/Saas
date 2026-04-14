// frontend/src/modules/landing/pages/Home.jsx
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Modules } from '../components/Modules';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Modules />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};