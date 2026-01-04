'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui';
import { useLanguage, getTranslation, landing } from '@/shared/i18n';

type FinalCTASectionProps = {
  onCtaClick: () => void;
  isLoading?: boolean;
};

export const FinalCTASection = ({ onCtaClick, isLoading }: FinalCTASectionProps) => {
  const lang = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 to-purple-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          {getTranslation(landing.finalCta.title1, lang)}
          <br />
          {getTranslation(landing.finalCta.title2, lang)}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto"
        >
          {getTranslation(landing.finalCta.subtitle, lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="xl"
            variant="secondary"
            onClick={onCtaClick}
            loading={isLoading}
            className="bg-white hover:bg-gray-100 text-gray-900"
          >
            {getTranslation(landing.finalCta.cta, lang)} — $3.99
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
          <p className="text-primary-200 text-sm">
            <span className="line-through opacity-60">$5</span>{' '}
            {getTranslation(landing.finalCta.pricing, lang)}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
