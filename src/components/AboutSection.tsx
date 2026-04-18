import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Properties Sold' },
  { value: '10+', label: 'Years Experience' },
  { value: '200+', label: 'Happy Clients' },
];

const features = [
  {
    title: 'Wide property selection',
    desc: 'Diverse residential and commercial listings across prime locations.',
  },
  {
    title: 'Market expertise',
    desc: 'Data-driven insights and local knowledge to guide your buying decisions.',
  },
  {
    title: 'Hassle-free transactions',
    desc: 'Smooth processes from property evaluation to closing.',
  },
];

export default function AboutSection() {
  return (
    <section className="bg-stone-100 py-20 lg:py-28" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">
              About Us
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
              Redefining the way you experience real estate
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-600">
              At Ambika, we are committed to making real estate transactions
              effortless. Whether you&apos;re buying your dream home or investing in
              commercial property, our experienced team provides personalized
              guidance every step of the way.
            </p>

            <div className="mt-10 space-y-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/10">
                    <svg
                      className="h-4 w-4 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{f.title}</h3>
                    <p className="mt-1 text-sm text-stone-500">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Stats + image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Modern luxury home interior"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-xl bg-white shadow-sm p-3 sm:p-5 text-center"
                >
                  <p className="font-serif text-xl sm:text-2xl font-bold text-primary-600">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
