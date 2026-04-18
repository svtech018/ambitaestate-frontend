import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { adminReviewService } from '../../services/api';
import type { AdminReview, ReviewType } from '../../types';

type ReviewFormErrors = Partial<Record<'reviewerName' | 'reviewText' | 'youtubeUrl', string>>;

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

const emptyReview: AdminReview = {
  reviewerName: '',
  reviewerRole: '',
  reviewType: 'TEXT',
  rating: 5,
  reviewText: '',
  youtubeUrl: '',
  showOnHomepage: false,
  sortOrder: 0,
  active: true,
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [form, setForm] = useState<AdminReview>(emptyReview);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ReviewFormErrors>({});

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  const loadReviews = async () => {
    try {
      const page = await adminReviewService.getAll();
      setReviews(page.content);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: ReviewFormErrors = {};
    if (!form.reviewerName.trim()) {
      errors.reviewerName = 'Reviewer name is required.';
    }
    if (form.reviewType === 'TEXT' && !form.reviewText.trim()) {
      errors.reviewText = 'Review text is required.';
    }
    if (form.reviewType === 'VIDEO') {
      if (!form.youtubeUrl.trim()) {
        errors.youtubeUrl = 'YouTube URL is required.';
      } else if (!extractYouTubeId(form.youtubeUrl)) {
        errors.youtubeUrl = 'Enter a valid YouTube URL.';
      }
    }
    setFieldErrors(errors);
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      focusField(`review-${firstErrorField}`);
      return;
    }

    try {
      if (editingId) {
        await adminReviewService.update(editingId, form);
        showMessage('Review updated successfully.');
      } else {
        await adminReviewService.create(form);
        showMessage('Review created successfully.');
      }
      setForm(emptyReview);
      setEditingId(null);
      setIsFormOpen(false);
      setFieldErrors({});
      await loadReviews();
    } catch {
      showMessage('Failed to save review.');
    }
  };

  const startEdit = (review: AdminReview) => {
    setEditingId(review.id ?? null);
    setForm({ ...review });
    setFieldErrors({});
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeReview = async (id?: number) => {
    if (!id) return;
    await adminReviewService.remove(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyReview);
      setIsFormOpen(false);
    }
    showMessage('Review deleted.');
    await loadReviews();
  };

  const toggleHomepage = async (review: AdminReview) => {
    if (!review.id) return;
    await adminReviewService.update(review.id, {
      ...review,
      showOnHomepage: !review.showOnHomepage,
    });
    await loadReviews();
  };

  return (
    <div className="space-y-8">
      {/* Header + Table */}
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Reviews</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900">Manage Reviews</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {message && (
              <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setIsFormOpen((c) => {
                  if (c) {
                    setEditingId(null);
                    setForm(emptyReview);
                  }
                  return !c;
                });
              }}
              className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-primary-400"
            >
              {isFormOpen ? 'Close form' : '+ Add Review'}
            </button>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-stone-200 py-16 text-center">
            <p className="text-lg font-medium text-stone-400">No reviews yet</p>
            <p className="mt-1 text-sm text-stone-400">Click &quot;+ Add Review&quot; to create your first review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Reviewer</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Rating</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Preview</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Homepage</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reviews.map((review) => {
                  const videoId = review.youtubeUrl ? extractYouTubeId(review.youtubeUrl) : null;
                  return (
                    <tr key={review.id} className="transition-colors hover:bg-stone-50">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-stone-900">{review.reviewerName}</p>
                        <p className="text-xs text-stone-500">{review.reviewerRole}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            review.reviewType === 'TEXT'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {review.reviewType === 'TEXT' ? 'Text' : 'Video'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {review.reviewType === 'TEXT' && review.rating ? (
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < review.rating! ? 'text-amber-400' : 'text-stone-200'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        {review.reviewType === 'TEXT' ? (
                          <p className="truncate text-stone-600">{review.reviewText}</p>
                        ) : videoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                            alt="thumbnail"
                            className="h-12 w-16 rounded object-cover"
                          />
                        ) : (
                          <span className="text-stone-400">No URL</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => void toggleHomepage(review)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            review.showOnHomepage ? 'bg-primary-500' : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              review.showOnHomepage ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(review)}
                            className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeReview(review.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Form */}
      {isFormOpen && (
        <section className="rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Review form</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">
              {editingId ? 'Edit Review' : 'Add New Review'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            {/* Review type toggle */}
            <div className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-stone-700">Review Type</span>
              <div className="flex gap-3">
                {(['TEXT', 'VIDEO'] as ReviewType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      {
                        setForm((f) => ({
                          ...f,
                          reviewType: type,
                          ...(type === 'VIDEO' ? { rating: null, reviewText: '' } : { youtubeUrl: '' }),
                        }));
                        setFieldErrors({});
                      }
                    }
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                      form.reviewType === type
                        ? 'bg-primary-500 text-stone-950'
                        : 'border border-stone-300 text-stone-600 hover:border-primary-400'
                    }`}
                  >
                    {type === 'TEXT' ? 'Text Review' : 'YouTube Video'}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Reviewer Name *</span>
              <input
                id="review-reviewerName"
                value={form.reviewerName}
                onChange={(e) => {
                  setForm({ ...form, reviewerName: e.target.value });
                  setFieldErrors((current) => ({ ...current, reviewerName: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.reviewerName)}
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-1 ${fieldErrors.reviewerName ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                required
              />
              {fieldErrors.reviewerName && <p className="mt-2 text-sm text-red-600">{fieldErrors.reviewerName}</p>}
            </label>

            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Reviewer Role</span>
              <input
                value={form.reviewerRole}
                onChange={(e) => setForm({ ...form, reviewerRole: e.target.value })}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g. Homeowner, Investor"
              />
            </label>

            {form.reviewType === 'TEXT' && (
              <>
                <div className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <svg
                          className={`h-8 w-8 ${
                            (form.rating ?? 0) >= star ? 'text-amber-400' : 'text-stone-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                  <span className="mb-2 block">Review Text *</span>
                  <textarea
                    id="review-reviewText"
                    value={form.reviewText}
                    onChange={(e) => {
                      setForm({ ...form, reviewText: e.target.value });
                      setFieldErrors((current) => ({ ...current, reviewText: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.reviewText)}
                    className={`min-h-28 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-1 ${fieldErrors.reviewText ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                    required
                  />
                  {fieldErrors.reviewText && <p className="mt-2 text-sm text-red-600">{fieldErrors.reviewText}</p>}
                </label>
              </>
            )}

            {form.reviewType === 'VIDEO' && (
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                <span className="mb-2 block">YouTube URL *</span>
                <input
                  id="review-youtubeUrl"
                  value={form.youtubeUrl}
                  onChange={(e) => {
                    setForm({ ...form, youtubeUrl: e.target.value });
                    setFieldErrors((current) => ({ ...current, youtubeUrl: undefined }));
                  }}
                  aria-invalid={Boolean(fieldErrors.youtubeUrl)}
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-1 ${fieldErrors.youtubeUrl ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                  placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                  required
                />
                {fieldErrors.youtubeUrl && <p className="mt-2 text-sm text-red-600">{fieldErrors.youtubeUrl}</p>}
                {form.youtubeUrl && extractYouTubeId(form.youtubeUrl) && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-stone-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(form.youtubeUrl)}`}
                      className="aspect-video w-full max-w-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Preview"
                    />
                  </div>
                )}
              </label>
            )}

            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Sort Order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="0"
              />
            </label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={form.showOnHomepage}
                  onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-primary-500 focus:ring-primary-500"
                />
                Show on Homepage
              </label>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-primary-400"
              >
                {editingId ? 'Update Review' : 'Create Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyReview);
                  setIsFormOpen(false);
                  setFieldErrors({});
                }}
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
