import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from '../services/api';
import type { Review } from '../types';

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export default function ReviewsSection() {
  const [textReviews, setTextReviews] = useState<Review[]>([]);
  const [videoReviews, setVideoReviews] = useState<Review[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService
      .getHomepageReviews()
      .then((reviews) => {
        setTextReviews(reviews.filter((r) => r.reviewType === 'TEXT'));
        setVideoReviews(reviews.filter((r) => r.reviewType === 'VIDEO'));
      })
      .catch(() => {
        setTextReviews([]);
        setVideoReviews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasText = textReviews.length > 0;
  const hasVideo = videoReviews.length > 0;

  if (loading) {
    return (
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-primary-500" />
        </div>
      </section>
    );
  }

  if (!hasText && !hasVideo) return null;

  const current = hasText ? textReviews[active % textReviews.length] : null;
  const next = () => setActive((p) => (p + 1) % textReviews.length);
  const prev = () => setActive((p) => (p - 1 + textReviews.length) % textReviews.length);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
            Reviews
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            What our clients say
          </h2>
          <p className="mt-4 text-stone-500">
            Real stories from real people who trusted us with their property journey.
          </p>
        </motion.div>

        {/* Text Reviews Carousel */}
        {hasText && current && (
          <div className="relative mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-3xl rounded-2xl bg-stone-50 p-5 shadow-lg shadow-stone-200/50 sm:p-10"
              >
                {/* Stars */}
                {current.rating && (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < current.rating! ? 'text-amber-400' : 'text-stone-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                <blockquote className="mt-6 font-serif text-lg leading-relaxed text-stone-700 sm:text-xl">
                  &ldquo;{current.reviewText}&rdquo;
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                    {current.reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{current.reviewerName}</p>
                    {current.reviewerRole && (
                      <p className="text-sm text-stone-500">{current.reviewerRole}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {textReviews.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-400 transition-colors hover:border-primary-500 hover:text-primary-600"
                  aria-label="Previous review"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {textReviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === active % textReviews.length
                          ? 'w-8 bg-primary-500'
                          : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-400 transition-colors hover:border-primary-500 hover:text-primary-600"
                  aria-label="Next review"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* YouTube Video Reviews */}
        {hasVideo && (
          <div className={hasText ? 'mt-20' : 'mt-16'}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
                Video Reviews
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-stone-900">
                See what they have to say
              </h3>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videoReviews.map((review) => {
                const videoId = review.youtubeUrl ? extractYouTubeId(review.youtubeUrl) : null;
                if (!videoId) return null;
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="group overflow-hidden rounded-2xl bg-stone-50 shadow-md shadow-stone-200/50 transition-shadow hover:shadow-lg"
                  >
                    <div className="aspect-[9/16] w-full sm:aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Review by ${review.reviewerName}`}
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-stone-900">{review.reviewerName}</p>
                      {review.reviewerRole && (
                        <p className="text-sm text-stone-500">{review.reviewerRole}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
