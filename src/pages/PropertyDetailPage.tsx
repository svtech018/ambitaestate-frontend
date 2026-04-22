import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '../services/api';
import ContactForm from '../components/ContactForm';
import type { Property, PropertyType } from '../types';

const placeholderImg =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatArea(area: number, unit?: string): string {
  const label = unit === 'CENTS' ? 'Cents' : 'Sq.ft';
  return `${area.toLocaleString()} ${label}`;
}

function toYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be short links
  const shortMatch = /youtu\.be\/([A-Za-z0-9_-]{11})/.exec(url);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Handle standard watch?v= links (strip extra params)
  const watchMatch = /[?&]v=([A-Za-z0-9_-]{11})/.exec(url);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Already an embed URL or unrecognised – return as-is
  return url;
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  LAND_PLOTS: 'Land/Plots',
  HOUSES_BUNGALOWS: 'Houses/Bungalows',
  APARTMENTS_FLATS: 'Apartments/Flats',
  COMMERCIAL_SHOPS: 'Commercial Shops/Spaces',
  COFFEE_ESTATES: 'Coffee Estates',
  AGRICULTURE_LANDS: 'Agriculture Lands',
  RESORT_SPA: 'Resort/Spa',
};

function showBedrooms(type: PropertyType) {
  return type === 'HOUSES_BUNGALOWS' || type === 'APARTMENTS_FLATS';
}
function showBathrooms(type: PropertyType) {
  return type === 'HOUSES_BUNGALOWS' || type === 'APARTMENTS_FLATS' || type === 'COMMERCIAL_SHOPS';
}
function showParking(type: PropertyType) {
  return type !== 'LAND_PLOTS' && type !== 'AGRICULTURE_LANDS';
}
function showYearBuilt(type: PropertyType) {
  return type !== 'LAND_PLOTS' && type !== 'AGRICULTURE_LANDS';
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    propertyService
      .getById(Number(id))
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
              <div className="h-32 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Property Not Found
          </h2>
          <p className="mt-3 text-stone-500">
            The property you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-block rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-dark-950"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  const images =
    property.imageUrls.length > 0 ? property.imageUrls : [placeholderImg];

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <Link to="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-600">
            Properties
          </Link>
          <span>/</span>
          <span className="text-stone-800">{property.title}</span>
        </nav>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-stone-100">
            <img
              src={images[activeImage] ?? placeholderImg}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex gap-2 sm:left-6 sm:top-6">
              <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-dark-950 sm:px-4 sm:py-1.5 sm:text-sm">
                For {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-dark-900 sm:px-4 sm:py-1.5 sm:text-sm">
                {PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === activeImage
                      ? 'border-primary-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {/* Main info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight tracking-tight">
                  {property.title}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-stone-500">
                  {property.address}, {property.city}, {property.state}{' '}
                  {property.zipCode}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="font-serif text-3xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </p>
                {property.listingType === 'RENT' && (
                  <p className="text-sm text-stone-500">per month</p>
                )}
              </div>
            </div>

            {/* Key stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {showBedrooms(property.propertyType) && (
                <div className="rounded-xl bg-white shadow-sm p-4 text-center">
                  <p className="font-serif text-base font-bold text-stone-900 sm:text-xl">{property.bedrooms}</p>
                  <p className="mt-1 text-xs text-stone-500">Bedrooms</p>
                </div>
              )}
              {showBathrooms(property.propertyType) && (
                <div className="rounded-xl bg-white shadow-sm p-4 text-center">
                  <p className="font-serif text-base font-bold text-stone-900 sm:text-xl">{property.bathrooms}</p>
                  <p className="mt-1 text-xs text-stone-500">Bathrooms</p>
                </div>
              )}
              <div className="rounded-xl bg-white shadow-sm p-4 text-center">
                <p className="font-serif text-base font-bold text-stone-900 sm:text-xl">{formatArea(property.area, property.areaUnit)}</p>
                <p className="mt-1 text-xs text-stone-500">Area</p>
              </div>
              {showYearBuilt(property.propertyType) && (
                <div className="rounded-xl bg-white shadow-sm p-4 text-center">
                  <p className="font-serif text-base font-bold text-stone-900 sm:text-xl">{property.yearBuilt || 'N/A'}</p>
                  <p className="mt-1 text-xs text-stone-500">Year Built</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                About this property
              </h2>
              <p className="mt-4 leading-relaxed text-stone-600">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Amenities
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-600"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {property.youtubeVideoUrl && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Video Tour
                </h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={toYouTubeEmbedUrl(property.youtubeVideoUrl)}
                    title="Property video tour"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Details table */}
            <div className="mt-10">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Property Details
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-stone-200">
                {[
                  ['Property Type', PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType],
                  ['Listing Type', property.listingType === 'SALE' ? 'For Sale' : 'For Rent'],
                  ...(showBedrooms(property.propertyType) ? [
                    ['Bedrooms', property.bedrooms],
                  ] : []),
                  ...(showBathrooms(property.propertyType) ? [
                    ['Bathrooms', property.bathrooms],
                  ] : []),
                  ...(showParking(property.propertyType) ? [
                    ['Parking Spaces', property.parkingSpaces || 'N/A'],
                  ] : []),
                  ['Area', formatArea(property.area, property.areaUnit)],
                  ...(showYearBuilt(property.propertyType) ? [
                    ['Year Built', property.yearBuilt || 'N/A'],
                  ] : []),
                  ['Views', property.viewsCount?.toLocaleString() || '0'],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-white p-4">
                    <p className="text-xs text-stone-500">{label}</p>
                    <p className="mt-1 font-medium text-stone-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/60">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Show on Maps
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                View this property location directly in Google Maps and get directions instantly.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-dark-950 transition-all hover:bg-primary-400 hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  Show on Maps
                </a>
                <p className="text-sm text-stone-500">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Quick inquiry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:sticky lg:top-24"
          >
            <div className="rounded-2xl bg-white p-6 shadow-lg shadow-stone-200/50">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Interested in this property?
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Fill out the form below and our team will reach out.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Full contact form */}
        <div className="mt-16">
          <ContactForm
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </main>
  );
}
