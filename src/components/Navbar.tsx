import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ambikaLogo from '../assets/images/IMG_6713.png';

const propertyCategories = [
  { label: 'All Properties', value: '' },
  { label: 'Land/Plots', value: 'LAND_PLOTS' },
  { label: 'Houses/Bungalows', value: 'HOUSES_BUNGALOWS' },
  { label: 'Apartments/Flats', value: 'APARTMENTS_FLATS' },
  { label: 'Commercial Shops/Spaces', value: 'COMMERCIAL_SHOPS' },
  { label: 'Coffee Estates', value: 'COFFEE_ESTATES' },
  { label: 'Agriculture Lands', value: 'AGRICULTURE_LANDS' },
  { label: 'Resort/Spa', value: 'RESORT_SPA' },
];

const baseNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPropertiesOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPropertiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bgClass =
    scrolled || !isHome
      ? 'bg-white/95 backdrop-blur-md shadow-md'
      : 'bg-transparent';

  const isPropertiesActive = location.pathname === '/properties';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={ambikaLogo}
            alt="Ambika Real Estate"
            className="h-10 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary-600 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-stone-600'
              }`}
            >
              Home
            </Link>
          </li>

          {/* Properties with dropdown */}
          <li ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setPropertiesOpen((o) => !o)}
              className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-primary-600 ${
                isPropertiesActive ? 'text-primary-600' : 'text-stone-600'
              }`}
            >
              Properties
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${propertiesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {propertiesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-xl shadow-stone-200/60 ring-1 ring-stone-100"
                >
                  {propertyCategories.map((cat) => (
                    <Link
                      key={cat.value}
                      to={cat.value ? `/properties?type=${cat.value}` : '/properties'}
                      className="block px-5 py-3 text-sm text-stone-700 transition-colors hover:bg-primary-50 hover:text-primary-600 first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          <li>
            <Link
              to="/#about"
              className="text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-primary-600"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/#contact"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary-600 ${
                location.pathname === '/contact' ? 'text-primary-600' : 'text-stone-600'
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="-mr-2 p-2 text-stone-900 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-stone-200 bg-white/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col px-6 py-6">
              {baseNavLinks.map((link) => (
                <li key={link.name} className="py-2">
                  <Link
                    to={link.path}
                    className="block text-lg font-medium text-stone-700 transition-colors hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* Mobile Properties accordion */}
              <li className="py-2">
                <button
                  type="button"
                  onClick={() => setMobilePropertiesOpen((o) => !o)}
                  className="flex w-full items-center justify-between text-lg font-medium text-stone-700"
                >
                  Properties
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-200 ${mobilePropertiesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {mobilePropertiesOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 overflow-hidden pl-4"
                    >
                      {propertyCategories.map((cat) => (
                        <li key={cat.value}>
                          <Link
                            to={cat.value ? `/properties?type=${cat.value}` : '/properties'}
                            className="block py-2 text-sm text-stone-600 transition-colors hover:text-primary-600"
                          >
                            {cat.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li className="mt-4">
                <Link
                  to="/#contact"
                  className="inline-block rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-dark-950"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
