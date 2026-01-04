'use client';

import { motion } from 'framer-motion';
import { useLanguage, useTranslations } from '@/shared/i18n';

const stepIcons = ['💳', '🎙️', '✨', '📄'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const HowItWorksSection = () => {
  const lang = useLanguage();
  const { landing } = useTranslations(lang);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary-600 font-semibold mb-4"
          >
            {landing.howItWorks.tag}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {landing.howItWorks.title1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              {landing.howItWorks.title2}
            </span>
          </motion.h2>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {landing.howItWorks.steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector line */}
              {index < landing.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
              )}

              <div className="relative bg-gray-50 rounded-2xl p-8 hover:bg-primary-50 transition-colors">
                {/* Step number */}
                <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary-100">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="relative text-4xl mb-4">{stepIcons[index]}</div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
