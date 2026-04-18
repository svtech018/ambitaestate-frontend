import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '../services/api';
import PropertyCard from './PropertyCard';
import type { Property } from '../types';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getFeatured()
      .then((page) => setProperties(page.content))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-stone-50 py-16 lg:py-24" id="properties">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
            Properties
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            Find homes that perfectly
            <br className="hidden sm:block" /> match your lifestyle
          </h2>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="mt-16 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-stone-200"
              />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 6).map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-16 py-12 text-center text-stone-400 text-base">
            No featured properties found. Check back soon!
          </p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-8 py-3 text-sm font-semibold text-stone-800 transition-all hover:border-primary-500 hover:text-primary-600"
          >
            View all properties
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
