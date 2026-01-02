"use client";

import {
  LandingNav,
  HeroSection,
  FeaturesSection,
  HowItWorks,
  PricingSection,
  LandingFooter,
} from "@/components/landing";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base text-navy">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <div id="how-it-works" className="border-t border-navy/5">
        <HowItWorks />
      </div>
      <section className="border-t border-navy/5">
        <PricingSection />
      </section>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
