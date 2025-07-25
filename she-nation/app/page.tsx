import { HeroSection } from "@/components/home/hero-section";
// import { StatsSection } from "@/components/home/stats-section"
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import React from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
