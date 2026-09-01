import StickyNavbar from "../components/landing/StickyNavbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Benefits from "../components/landing/Benefits";
import Testimonials from "../components/landing/Testimonials";
import FAQ from "../components/landing/FAQ";
import DeveloperSection from "../components/landing/DeveloperSection";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="landing-page bg-background">
      <StickyNavbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <FAQ />
      <DeveloperSection />
      <Footer />
    </div>
  );
}
