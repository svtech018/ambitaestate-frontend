import { useEffect, useState } from 'react';
import { adminInquiryService } from '../../services/api';
import type { AdminInquiry } from '../../types';

function formatDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});

  const loadInquiries = async () => {
    const page = await adminInquiryService.getAll();
    setInquiries(page.content);
    setDraftNotes(
      Object.fromEntries(page.content.map((inquiry) => [inquiry.id, inquiry.adminNotes ?? '']))
    );
  };

  useEffect(() => {
    void loadInquiries().catch(() => setInquiries([]));
  }, []);

  const saveNotes = async (id: number) => {
    await adminInquiryService.updateNotes(id, draftNotes[id] ?? '');
    await loadInquiries();
  };

  const deleteInquiry = async (id: number) => {
    await adminInquiryService.remove(id);
    await loadInquiries();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm shadow-stone-200/60">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Lead management</p>
        <h1 className="mt-3 font-serif text-4xl">Buyer inquiries</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">Review messages, capture internal follow-up notes, and keep the pipeline current.</p>
      </section>

      <section className="space-y-5">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-[2rem] bg-white p-6 shadow-sm shadow-stone-200/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">{inquiry.name}</h2>
                <p className="mt-1 text-sm text-stone-500">{inquiry.email} · {inquiry.phoneNumber || 'No phone number'}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-primary-600">{inquiry.propertyTitle || 'General inquiry'}</p>
              </div>
              <p className="text-sm text-stone-500">{formatDate(inquiry.submittedAt ?? inquiry.createdAt)}</p>
            </div>
            <p className="mt-5 rounded-3xl bg-stone-50 px-5 py-4 text-sm leading-7 text-stone-700">{inquiry.message}</p>
            <textarea
              value={draftNotes[inquiry.id] ?? ''}
              onChange={(event) => setDraftNotes((current) => ({ ...current, [inquiry.id]: event.target.value }))}
              className="mt-5 min-h-28 w-full rounded-3xl border border-stone-300 px-4 py-3"
              placeholder="Internal follow-up notes"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => void saveNotes(inquiry.id)} className="rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-stone-950">
                Save notes
              </button>
              <button type="button" onClick={() => void deleteInquiry(inquiry.id)} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">
                Delete inquiry
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}