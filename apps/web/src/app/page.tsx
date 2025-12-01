import Header from '@/components/marketing/Header';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import Journey from '@/components/marketing/Journey';
import Pricing from '@/components/marketing/Pricing';
import Footer from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Journey />
      <Pricing />
      <Footer />
    </div>
  );
}