'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui';
import { useLanguage, useTranslations } from '@/shared/i18n';

type HeroSectionProps = {
  onCtaClick: () => void;
  isLoading?: boolean;
};

export const HeroSection = ({ onCtaClick, isLoading }: HeroSectionProps) => {
  const lang = useLanguage();
  const { landing } = useTranslations(lang);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700
                     rounded-full text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          {landing.hero.title1} {landing.hero.title2}
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6"
        >
          {landing.hero.subtitle1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
            {landing.hero.subtitle2}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {landing.hero.description1}{' '}
          <span className="font-semibold text-gray-900">{landing.hero.description2}</span>{' '}
          {landing.hero.description3}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="xl"
            onClick={onCtaClick}
            loading={isLoading}
            className="group"
          >
            {landing.hero.cta} — $3.99
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
          <p className="text-sm text-gray-500">
            <span className="line-through text-gray-400">$5</span>{' '}
            <span className="text-primary-600 font-medium">{landing.hero.earlyAccessPricing}</span>
            {' '}· {landing.hero.noSubscription}
          </p>
        </motion.div>

        {/* Early access badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
            <span className="text-amber-600 text-sm">🚀</span>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{landing.hero.earlyAccess}</span> — {landing.hero.beAmongFirst}
            </p>
          </div>
          <p className="text-xs text-gray-400">
            {landing.hero.poweredBy}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
