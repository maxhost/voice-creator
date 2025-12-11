'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How does the voice interview work?',
    answer: 'After payment, you\'ll enter a voice conversation with our AI interviewer. Just press and hold a button to talk, like a walkie-talkie. The AI asks questions to uncover your best insights, experiences, and perspectives. After 10 minutes, it generates 4-7 content ideas based on what you discussed.',
  },
  {
    question: 'What if I don\'t know what to talk about?',
    answer: 'That\'s the beauty of it! You don\'t need to prepare anything. The AI is trained to ask thought-provoking questions that pull great content out of you. Just talk about your work, your experiences, and your opinions. The AI does the heavy lifting.',
  },
  {
    question: 'Can I use the ideas for commercial content?',
    answer: 'Absolutely. You own 100% of the ideas generated. Use them for your business, your clients, or however you want. They\'re yours.',
  },
  {
    question: 'What platforms are the ideas optimized for?',
    answer: 'We generate ideas for LinkedIn, Twitter/X, Instagram, TikTok, and YouTube. Each idea comes with a platform recommendation based on the content type and format that would work best.',
  },
  {
    question: 'How is this different from ChatGPT?',
    answer: 'ChatGPT requires you to prompt it. You need to already know what you want to write about. Voice Creator interviews you—it extracts ideas you didn\'t even know you had through conversation. The output is deeply personalized to YOUR expertise, not generic AI content.',
  },
  {
    question: 'What if the session doesn\'t generate enough ideas?',
    answer: 'We guarantee a minimum of 4 content ideas per session. If your interview generates fewer than 4 ideas due to any issue on our end, you\'ll receive a full refund automatically.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No. Just pay and start. Your interview and ideas are delivered immediately. We don\'t require sign-ups or store unnecessary data.',
  },
  {
    question: 'Is my conversation recorded or stored?',
    answer: 'Your audio is processed in real-time to generate responses and extract insights. We don\'t store your recordings. Once your session ends and ideas are generated, the audio data is deleted.',
  },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-500"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary-600 font-semibold mb-4"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            Questions? Answers.
          </motion.h2>
        </div>

        {/* FAQ items */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
