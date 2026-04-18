import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bars3Icon, HomeModernIcon, QuestionMarkCircleIcon, UsersIcon, ArrowLeftOnRectangleIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { authService } from '../../services/api';

const navItems = [
  { to: '/admin', label: 'Overview', icon: HomeModernIcon, end: true },
  { to: '/admin/properties', label: 'Properties', icon: HomeModernIcon },
  { to: '/admin/reviews', label: 'Reviews', icon: StarIcon },
  { to: '/admin/inquiries', label: 'Inquiries', icon: QuestionMarkCircleIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-stone-200 bg-stone-900 px-6 py-8 text-stone-100 lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary-300">Admin</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold">Ambika Console</h1>
            <p className="mt-3 text-sm text-stone-400">Manage listings, leads, and internal users.</p>
          </div>
          <nav className="mt-10 space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-stone-950'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-2xl border border-stone-700 px-4 py-3 text-sm text-stone-300 transition-colors hover:border-primary-400 hover:text-white"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Sign out
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Administration</p>
                <h2 className="mt-1 font-serif text-2xl">Real Estate Control Room</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-primary-500 hover:text-primary-600 lg:inline-flex"
                >
                  Sign out
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen((current) => !current)}
                  className="inline-flex rounded-full border border-stone-300 p-2 text-stone-700 lg:hidden"
                  aria-label="Toggle admin menu"
                >
                  {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
              </div>
            </div>
            {mobileOpen && (
              <div className="border-t border-stone-200 bg-white px-5 py-4 lg:hidden">
                <nav className="space-y-2">
                  {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary-500 text-stone-950'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}
          </header>

          <main className="flex-1 px-5 py-8 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}