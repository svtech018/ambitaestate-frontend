import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
            Get in touch
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500">
            Have questions about our properties or need assistance? Our team is here to help you
            find your perfect property.
          </p>
        </motion.div>

        {/* Admin Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-2xl bg-white p-6 shadow-md shadow-stone-200/50 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-stone-900">Admin</h3>
            <p className="mt-1 text-sm text-stone-500">System Admin</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md shadow-stone-200/50 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-stone-900">Email</h3>
            <a href="mailto:admin@realestate.com" className="mt-1 block text-sm text-primary-600 hover:text-primary-700">
              admin@realestate.com
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md shadow-stone-200/50 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-stone-900">Phone</h3>
            <a href="tel:+919876543210" className="mt-1 block text-sm text-primary-600 hover:text-primary-700">
              +91 98765 43210
            </a>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md shadow-stone-200/50 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-stone-900">Location</h3>
            <p className="mt-1 text-sm text-stone-500">Mumbai, India</p>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 overflow-hidden rounded-2xl border border-stone-200 shadow-md shadow-stone-200/50"
        >
          <iframe
            title="Office location"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent('Mumbai, India')}&output=embed`}
            allowFullScreen
          />
        </motion.div>

        {/* Contact Form */}
        <div className="mt-14">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
