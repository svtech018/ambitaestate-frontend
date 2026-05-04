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

        {/* Text Reviews Grid */}
        {hasText && (
          <div className="mt-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {textReviews.slice(0, 4).map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-2xl bg-stone-50 p-6 shadow-md shadow-stone-200/50"
                >
                  {/* Stars */}
                  {review.rating && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating! ? 'text-amber-400' : 'text-stone-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}

                  <blockquote className="mt-4 font-serif text-sm leading-relaxed text-stone-700 line-clamp-4">
                    &ldquo;{review.reviewText}&rdquo;
                  </blockquote>

                  <div className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-900 text-sm">{review.reviewerName}</p>
                      {review.reviewerRole && (
                        <p className="truncate text-xs text-stone-500">{review.reviewerRole}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
