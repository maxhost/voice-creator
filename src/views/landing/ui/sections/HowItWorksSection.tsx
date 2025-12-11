'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Start the Interview',
    description: 'Click the button, pay $5, and you\'re in. No account, no friction.',
    icon: '💳',
  },
  {
    number: '02',
    title: 'Talk to the AI',
    description: 'Have a natural 10-minute voice conversation. The AI asks smart questions to uncover your best ideas.',
    icon: '🎙️',
  },
  {
    number: '03',
    title: 'Get Your Content Ideas',
    description: 'Receive 4-7 fully-formed post ideas with titles, descriptions, and platform recommendations.',
    icon: '✨',
  },
  {
    number: '04',
    title: 'Download & Create',
    description: 'Export your ideas as a PDF. Start creating content that actually resonates.',
    icon: '📄',
  },
];

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
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            From conversation to content
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              in 10 minutes
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
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
              )}

              <div className="relative bg-gray-50 rounded-2xl p-8 hover:bg-primary-50 transition-colors">
                {/* Step number */}
                <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary-100">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="relative text-4xl mb-4">{step.icon}</div>

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
