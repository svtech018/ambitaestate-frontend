import { useEffect, useState } from 'react';
import { adminInquiryService, adminPropertyService, adminUserService } from '../../services/api';
import type { AdminInquiry, AdminProperty, AdminUser } from '../../types';

function formatDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    void Promise.all([
      adminPropertyService.getAll(0, 5).then((page) => setProperties(page.content)).catch(() => setProperties([])),
      adminInquiryService.getAll(0, 5).then((page) => setInquiries(page.content)).catch(() => setInquiries([])),
      adminUserService.getAll(0, 5).then((page) => setUsers(page.content)).catch(() => setUsers([])),
    ]);
  }, []);

  const cards = [
    { label: 'Listings loaded', value: properties.length, tone: 'bg-primary-50 text-primary-700' },
    { label: 'Recent inquiries', value: inquiries.length, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Visible staff', value: users.length, tone: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm shadow-stone-200/60">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Overview</p>
        <h1 className="mt-3 font-serif text-4xl">Admin dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          A single place for operational visibility across live inventory, fresh buyer outreach, and admin access control.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.label} className={`rounded-3xl px-6 py-5 ${card.tone}`}>
              <p className="text-sm uppercase tracking-[0.2em]">{card.label}</p>
              <p className="mt-4 font-serif text-4xl">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[2rem] bg-white p-6 shadow-sm shadow-stone-200/60">
          <h2 className="font-serif text-2xl">Recent properties</h2>
          <div className="mt-5 space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium text-stone-900">{property.title}</p>
                <p className="mt-1 text-sm text-stone-500">{property.city}, {property.state}</p>
                <p className="mt-2 text-sm text-primary-700">{property.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-sm shadow-stone-200/60">
          <h2 className="font-serif text-2xl">Recent inquiries</h2>
          <div className="mt-5 space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium text-stone-900">{inquiry.name}</p>
                <p className="mt-1 text-sm text-stone-500">{inquiry.email}</p>
                <p className="mt-2 text-xs text-stone-400">{formatDate(inquiry.submittedAt ?? inquiry.createdAt)}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-sm shadow-stone-200/60">
          <h2 className="font-serif text-2xl">Admin users</h2>
          <div className="mt-5 space-y-4">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-stone-200 p-4">
                <p className="font-medium text-stone-900">{user.firstName} {user.lastName}</p>
                <p className="mt-1 text-sm text-stone-500">@{user.username}</p>
                <p className="mt-2 text-xs text-stone-400">{user.role} · {user.active ? 'Active' : 'Inactive'}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}