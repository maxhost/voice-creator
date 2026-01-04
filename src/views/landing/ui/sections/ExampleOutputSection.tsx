'use client';

import { motion } from 'framer-motion';
import { useLanguage, useTranslations } from '@/shared/i18n';

const examplePosts = [
  {
    platform: 'LinkedIn',
    platformColor: 'bg-blue-100 text-blue-700',
    title: '5 Mistakes I Made Scaling My First Startup (And How You Can Avoid Them)',
    description: 'A carousel post sharing the hard lessons from your entrepreneurship journey, with actionable takeaways for each mistake.',
    type: 'Carousel',
  },
  {
    platform: 'Twitter/X',
    platformColor: 'bg-gray-100 text-gray-700',
    title: 'The counterintuitive truth about productivity...',
    description: 'A thread unpacking your unique perspective on why working less can mean accomplishing more, backed by your personal experience.',
    type: 'Thread',
  },
  {
    platform: 'Instagram',
    platformColor: 'bg-pink-100 text-pink-700',
    title: '"The best investment I ever made wasn\'t in stocks..."',
    description: 'A quote graphic with your memorable insight about investing in skills, perfect for saves and shares.',
    type: 'Quote Card',
  },
  {
    platform: 'YouTube',
    platformColor: 'bg-red-100 text-red-700',
    title: 'Why I Stopped Chasing Clients (And They Started Chasing Me)',
    description: 'A 5-7 minute video script outline explaining your positioning strategy, with hooks and key talking points.',
    type: 'Video Script',
  },
];

export const ExampleOutputSection = () => {
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
            {landing.exampleOutput.tag}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {landing.exampleOutput.title1}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {landing.exampleOutput.subtitle}
          </motion.p>
        </div>

        {/* Example cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {examplePosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.platformColor}`}>
                  {post.platform}
                </span>
                <span className="text-sm text-gray-400">{post.type}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                "{post.title}"
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          {landing.exampleOutput.disclaimer}
        </motion.p>
      </div>
    </section>
  );
};
