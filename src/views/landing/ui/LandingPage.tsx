'use client';

import { usePayment } from '@/features/payment';
import {
  HeroSection,
  HowItWorksSection,
  BenefitsSection,
  ExampleOutputSection,
  PricingSection,
  FAQSection,
  FinalCTASection,
  FooterSection,
} from './sections';

export const LandingPage = () => {
  const { initiateCheckout, isLoading, error } = usePayment();

  return (
    <main className="min-h-screen">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      <HeroSection onCtaClick={initiateCheckout} isLoading={isLoading} />
      <HowItWorksSection />
      <BenefitsSection />
      <ExampleOutputSection />
      <PricingSection onCtaClick={initiateCheckout} isLoading={isLoading} />
      <FAQSection />
      <FinalCTASection onCtaClick={initiateCheckout} isLoading={isLoading} />
      <FooterSection />
    </main>
  );
};
