import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { inquiryService, publicContactService } from '../services/api';
import CustomSelect from './CustomSelect';

interface Props {
  propertyId?: number;
  propertyTitle?: string;
}

type ContactFormErrors = Partial<Record<'name' | 'email' | 'phoneNumber' | 'message', string>>;

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

export default function ContactForm({ propertyId, propertyTitle }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
    preferredContactTime: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [contactInfo, setContactInfo] = useState({
    fullName: 'System Admin',
    email: 'admin@realestate.com',
    phoneNumber: '',
    location: '',
  });

  useEffect(() => {
    publicContactService
      .getContactInfo()
      .then((contact) => {
        setContactInfo({
          fullName: contact.fullName,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          location: contact.location ?? '',
        });
      })
      .catch(() => undefined);
  }, []);

  const displayPhoneNumber = useMemo(() => {
    if (!contactInfo.phoneNumber) {
      return 'Not available';
    }

    const digits = contactInfo.phoneNumber.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return contactInfo.phoneNumber;
  }, [contactInfo.phoneNumber]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field as keyof ContactFormErrors]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field as keyof ContactFormErrors];
      return next;
    });
  };

  const validateForm = (): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (form.phoneNumber.trim() && !/^[+]?[0-9\s()-]{7,20}$/.test(form.phoneNumber.trim())) {
      errors.phoneNumber = 'Enter a valid phone number.';
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required.';
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      focusField(firstErrorField === 'phoneNumber' ? 'phone' : firstErrorField);
      setStatus('idle');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      await inquiryService.submit({
        ...(propertyId ? { propertyId } : {}),
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber || undefined,
        message: form.message,
        preferredContactTime: form.preferredContactTime || undefined,
      });
      setStatus('success');
      setFieldErrors({});
      setForm({ name: '', email: '', phoneNumber: '', message: '', preferredContactTime: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-stone-100 py-20 lg:py-28" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
              Get in touch
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
              {propertyTitle
                ? `Inquire about ${propertyTitle}`
                : "Let's find your dream home"}
            </h2>
            <p className="mt-6 text-lg text-stone-600">
              Have a question or ready to start your property journey? Reach out
              to us and our team will get back to you within 24 hours.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Email</p>
                  <p className="font-medium text-stone-900">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Phone</p>
                  <p className="font-medium text-stone-900">{displayPhoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Contact Person</p>
                  <p className="font-medium text-stone-900">{contactInfo.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Location</p>
                  <p className="font-medium text-stone-900">{contactInfo.location || 'Not available'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl bg-white p-8 shadow-lg shadow-stone-200/50 sm:p-10"
            >
              {/* Floating label inputs */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={`peer w-full rounded-lg border bg-transparent px-4 pb-2 pt-6 text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 ${fieldErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                  placeholder="Full Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-4 top-2 text-xs text-stone-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                {fieldErrors.name && <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>}
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`peer w-full rounded-lg border bg-transparent px-4 pb-2 pt-6 text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-xs text-stone-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                {fieldErrors.email && <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  value={form.phoneNumber}
                  onChange={(e) => update('phoneNumber', e.target.value)}
                  aria-invalid={Boolean(fieldErrors.phoneNumber)}
                  className={`peer w-full rounded-lg border bg-transparent px-4 pb-2 pt-6 text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 ${fieldErrors.phoneNumber ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                  placeholder="Phone"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-2 text-xs text-stone-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600"
                >
                  Phone Number
                </label>
                {fieldErrors.phoneNumber && <p className="mt-2 text-sm text-red-600">{fieldErrors.phoneNumber}</p>}
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  required
                  rows={4}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={`peer w-full resize-none rounded-lg border bg-transparent px-4 pb-2 pt-6 text-stone-900 placeholder-transparent focus:outline-none focus:ring-1 ${fieldErrors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-stone-300 focus:border-primary-500 focus:ring-primary-500'}`}
                  placeholder="Message"
                />
                <label
                  htmlFor="message"
                  className="absolute left-4 top-2 text-xs text-stone-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                {fieldErrors.message && <p className="mt-2 text-sm text-red-600">{fieldErrors.message}</p>}
              </div>

              <CustomSelect
                value={form.preferredContactTime}
                onChange={(value) => update('preferredContactTime', value)}
                options={[
                  { label: 'Preferred contact time (optional)', value: '' },
                  { label: 'Morning (9AM - 12PM)', value: 'Morning' },
                  { label: 'Afternoon (12PM - 5PM)', value: 'Afternoon' },
                  { label: 'Evening (5PM - 8PM)', value: 'Evening' },
                ]}
                className="w-full"
              />

              {status === 'success' && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  Thank you! Your inquiry has been submitted. We&apos;ll be in
                  touch soon.
                </div>
              )}
              {status === 'error' && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-dark-950 transition-all hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
