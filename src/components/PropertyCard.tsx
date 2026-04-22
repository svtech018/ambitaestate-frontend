import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Property } from '../types';

const placeholderImg =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

interface Props {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: Props) {
  const image = property.imageUrls?.[0] || placeholderImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/properties/${property.id}`}
        className="group block overflow-hidden rounded-2xl bg-white shadow-md shadow-stone-200/50 transition-all hover:shadow-xl hover:shadow-stone-300/50"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-dark-950">
              For {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
            </span>
            {property.featured && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-dark-900">
                Featured
              </span>
            )}
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-4 left-4">
            <p className="font-serif text-2xl font-bold text-white">
              {formatPrice(property.price)}
              {property.listingType === 'RENT' && (
                <span className="text-sm font-normal text-white/70">/mo</span>
              )}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 style={{ fontFamily: 'Gupter, serif' }} className="text-lg font-semibold text-stone-900 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {property.city}, {property.state}
          </p>

          <div className="mt-4 flex items-center gap-2 sm:gap-4 border-t border-stone-100 pt-4 text-sm text-stone-500">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {property.bathrooms} Baths
              </span>
            )}
            {property.area > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                {property.area.toLocaleString()} {property.areaUnit === 'CENTS' ? 'Cents' : 'Sq.ft'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
