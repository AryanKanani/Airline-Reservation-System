import { FeaturedDestinations } from '../components/Landing/FeaturedDestinations';
import { FlightSearchSection } from '../components/Landing/FlightSearchSection';
import { Footer } from '../components/Landing/Footer';
import { HeroSection } from '../components/Landing/HeroSection';
import { Navbar } from '../components/Landing/Navbar';
import { PromoOffers } from '../components/Landing/PromoOffers';

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <HeroSection />
      <FlightSearchSection />
      <FeaturedDestinations />
      <PromoOffers />
      <Footer />
    </main>
  );
}
