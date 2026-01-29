"use client";

import {
  LandingNav,
  HeroSection,
  PathwayDivider,
  FAQFeaturesSection,
  PricingSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background-light text-navy app-texture">
      <LandingNav />
      <HeroSection />
      <PathwayDivider />
      <FAQFeaturesSection />
      <PricingSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
