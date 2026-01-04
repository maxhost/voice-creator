'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui';
import { useLanguage, useTranslations } from '@/shared/i18n';

type PricingSectionProps = {
  onCtaClick: () => void;
  isLoading?: boolean;
};

export const PricingSection = ({ onCtaClick, isLoading }: PricingSectionProps) => {
  const lang = useLanguage();
  const { landing } = useTranslations(lang);
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Left side - Pricing */}
            <div className="p-10 md:p-12">
              {/* Early access badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full mb-4">
                <span className="text-amber-600 text-xs">🚀</span>
                <span className="text-xs font-medium text-amber-800">{landing.pricing.title}</span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {landing.pricing.subtitle1}
                <br />
                {landing.pricing.subtitle2}
              </h2>
              <p className="text-gray-600 mb-8">
                {landing.pricing.description}
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl font-bold text-gray-900">$3.99</span>
                <span className="text-2xl text-gray-400 line-through">$5</span>
              </div>
              <p className="text-sm text-gray-500 mb-8">{landing.pricing.perInterview}</p>

              <Button
                size="lg"
                onClick={onCtaClick}
                loading={isLoading}
                className="w-full"
              >
                {landing.pricing.cta}
              </Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                {landing.pricing.securePayment}
              </p>
            </div>

            {/* Right side - What's included */}
            <div className="bg-gray-50 p-10 md:p-12">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {landing.pricing.includes}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.interview}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.ideas}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.platforms}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.details}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.pdf}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{landing.pricing.features.noAccount}</span>
                </li>
              </ul>

              <div className="mt-8 p-4 bg-primary-50 rounded-xl">
                <p className="text-sm text-primary-800">
                  <span className="font-semibold">{landing.pricing.guarantee.title}</span> {landing.pricing.guarantee.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
