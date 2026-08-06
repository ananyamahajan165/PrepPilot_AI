import LandingNav from "../components/landing/LandingNav";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import ConfidenceBuilder from "../components/landing/ConfidenceBuilder";
import Pricing from "../components/landing/Pricing";
import CTAAndFooter from "../components/landing/CTAAndFooter";

const Landing = () => {
  return (
    <>
      <LandingNav />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ConfidenceBuilder />
        <Pricing />
        <CTAAndFooter />
      </main>
    </>
  );
};

export default Landing;