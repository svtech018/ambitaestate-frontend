'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    quote:
      'Ambika made our dream of owning a home a reality. Their team guided us through every step with patience and expertise. Highly recommend!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    role: 'Property Investor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote:
      'Outstanding service and deep market knowledge. They helped me find the perfect investment property with excellent returns. Truly professional.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anita Desai',
    role: 'First-time Buyer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    quote:
      'As a first-time buyer, I was nervous about the process. The Ambika team made everything smooth and stress-free. They truly care about their clients.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Commercial Client',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    quote:
      'Their commercial property expertise is unmatched. Found us the ideal office space within budget and ahead of schedule. Exceptional professionals.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
            Testimonials
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            In our clients&apos; words
          </h2>
          <p className="mt-4 text-stone-500">
            What our clients say about the quality, service, and results we
            deliver.
          </p>
        </motion.div>

        <div className="relative mt-16 bg-white">
          {/* 2-Column Grid for Desktop, 1 for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12">
            {[0, 1].map((offset) => {
              const index = (currentIndex + offset) % testimonials.length;
              const testimonial = testimonials[index];
              
              if (!testimonial) return null;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl bg-stone-50 p-8 shadow-lg shadow-stone-200/50 sm:p-12"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-primary-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="mt-6 font-serif text-xl leading-relaxed text-stone-700 sm:text-2xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{testimonial.name}</p>
                      <p className="text-sm text-stone-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="rounded-full bg-primary-500 p-3 text-white hover:bg-primary-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-primary-500 w-8' : 'bg-stone-300'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="rounded-full bg-primary-500 p-3 text-white hover:bg-primary-600 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
