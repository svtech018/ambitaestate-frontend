import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=90';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      {/* Base dark tint */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Cinematic vignette — dark edges, open center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Content — pt-24 clears the fixed navbar, pb-16 clears the scroll indicator */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary-400 sm:text-sm"
        >
          Your trusted real estate agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
        >
          Discover the perfect place to call{' '}
          <span className="italic text-primary-400">home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-base text-white/75 sm:mt-6 sm:text-lg"
        >
          Offering exquisite luxury homes and properties. We make real estate
          transactions effortless with our expertise and dedication.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        >
          <Link
            to="/properties"
            className="rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-dark-950 transition-all hover:bg-primary-400 hover:shadow-lg hover:shadow-primary-500/25"
          >
            Browse Properties
          </Link>
          <Link
            to="/#contact"
            className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-primary-500 hover:text-primary-300"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-primary-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
