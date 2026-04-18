import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import CustomSelect from '../components/CustomSelect';
import type { Property, PropertyType, ListingType } from '../types';

const propertyTypes: { label: string; value: PropertyType | '' }[] = [
  { label: 'All Types', value: '' },
  { label: 'Land/Plots', value: 'LAND_PLOTS' },
  { label: 'Houses/Bungalows', value: 'HOUSES_BUNGALOWS' },
  { label: 'Apartments/Flats', value: 'APARTMENTS_FLATS' },
  { label: 'Commercial Shops/Spaces', value: 'COMMERCIAL_SHOPS' },
  { label: 'Coffee Estates', value: 'COFFEE_ESTATES' },
  { label: 'Agriculture Lands', value: 'AGRICULTURE_LANDS' },
  { label: 'Resort/Spa', value: 'RESORT_SPA' },
];

const listingTypes: { label: string; value: ListingType | '' }[] = [
  { label: 'Buy & Rent', value: '' },
  { label: 'For Sale', value: 'SALE' },
  { label: 'For Rent', value: 'RENT' },
];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const propertyType =
    ((searchParams.get('propertyType') ?? searchParams.get('type') ?? '') as PropertyType | '');
  const listingType = (searchParams.get('listingType') ?? '') as ListingType | '';
  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';

  useEffect(() => {
    const legacyType = searchParams.get('type');
    if (!legacyType || searchParams.get('propertyType')) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set('propertyType', legacyType);
    params.delete('type');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await propertyService.getAll({
        propertyType: propertyType || undefined,
        listingType: listingType || undefined,
        searchTerm: searchTerm || undefined,
        sortBy,
        sortDirection: 'desc',
        page,
        size: 12,
      });
      setProperties(result.content ?? []);
      setTotalPages(result.totalPages ?? 0);
    } catch (err) {
      console.error('[PropertiesPage] Failed to load properties:', err);
      setProperties([]);
      setFetchError(
        err instanceof Error ? err.message : 'Unable to load properties. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [propertyType, listingType, searchTerm, sortBy, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <main className="min-h-screen bg-stone-50 pt-28">
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            Properties
          </h1>
          <p className="mt-3 text-lg text-stone-500">
            Browse our curated collection of properties
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md shadow-stone-200/50 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:p-6"
        >
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:min-w-0">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              placeholder="Search by location, title..."
              className="w-full rounded-xl border border-stone-300 bg-transparent py-2.5 pl-10 pr-4 text-sm text-stone-900 shadow-sm placeholder-stone-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Type filter */}
          <CustomSelect
            value={propertyType}
            onChange={(value) => updateFilter('propertyType', value)}
            options={propertyTypes}
          />

          {/* Listing type */}
          <CustomSelect
            value={listingType}
            onChange={(value) => updateFilter('listingType', value)}
            options={listingTypes}
          />

          {/* Sort */}
          <CustomSelect
            value={sortBy}
            onChange={(value) => updateFilter('sortBy', value)}
            options={[
              { label: 'Newest first', value: 'createdAt' },
              { label: 'Price', value: 'price' },
              { label: 'Area', value: 'area' },
              { label: 'Popular', value: 'viewsCount' },
            ]}
          />
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="mt-12 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-stone-200"
              />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="mt-12 grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 pb-12">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(i));
                      setSearchParams(params);
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm transition-colors ${
                      page === i
                        ? 'bg-primary-500 text-dark-950 font-semibold'
                        : 'border border-stone-300 text-stone-500 hover:border-primary-500 hover:text-primary-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : fetchError ? (
          <div className="mt-24 text-center">
            <p className="text-lg text-red-500">Unable to load properties.</p>
            <p className="mt-2 text-sm text-stone-400">{fetchError}</p>
            <button
              onClick={() => fetchProperties()}
              className="mt-4 rounded-xl bg-primary-500 px-6 py-2 text-sm font-semibold text-dark-950 hover:bg-primary-400"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-20 mb-16 text-center">
            <p className="text-lg font-medium text-stone-500">No properties found.</p>
            <p className="mt-2 text-sm text-stone-400">
              Try adjusting your search filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
