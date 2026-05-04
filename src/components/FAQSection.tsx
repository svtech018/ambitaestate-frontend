import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'What services does your agency provide?',
    answer:
      'Our agency offers a wide range of services, including buying, selling, and renting residential and commercial properties.',
  },
  {
    id: 2,
    question: 'How do you determine the value of a property?',
    answer:
      'We use a combination of comparative market analysis, property condition assessments, and local market trends to determine the most accurate value for your property.',
  },
  {
    id: 3,
    question: 'What are the fees for your services?',
    answer:
      'Our fees and commissions vary depending on the type of service and the value of the property. Typically, real estate commissions range from 1% to 2% of the sale price.',
  },
  {
    id: 4,
    question: 'How long does it typically take to sell a property?',
    answer:
      'The time it takes to sell a property depends on various factors, including location, price, and property condition. On average, properties can sell within 30 to 90 days.',
  },
  {
    id: 5,
    question: 'What areas do you specialize in?',
    answer:
      'Our agency focuses on Arizona, with deep local knowledge and experience in both established neighborhoods and up-and-coming areas.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 mb-4">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
              FAQs
            </span>
          </div>
          <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            Your questions answered
          </h2>
          <p className="mt-4 text-stone-500">
            Here are the most common questions.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="overflow-hidden rounded-lg border border-stone-200 bg-white transition-all hover:shadow-md"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <span className="font-semibold text-stone-900">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-5 w-5 shrink-0 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-stone-100 bg-stone-50"
                  >
                    <div className="px-6 py-4 text-stone-600">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 rounded-2xl bg-stone-50 p-8 text-center"
        >
          <p className="text-stone-600">Didn't find your answer?</p>
          <a
            href="/#contact"
            className="mt-3 inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
