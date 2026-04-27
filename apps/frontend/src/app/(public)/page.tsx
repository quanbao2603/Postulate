import { HeroSection } from "@/components/home/HeroSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Postulate | Social Media OS",
  description: "The ultimate social media management operating system.",
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      {/* Future sections like Features, Testimonials, Pricing will go here */}
    </>
  );
}
