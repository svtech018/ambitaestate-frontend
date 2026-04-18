import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin';

  useEffect(() => {
    // Only auto-redirect if server session cookie is valid
    (async () => {
      const ok = await authService.check();
      if (ok) navigate('/admin', { replace: true });
    })();
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      nextErrors.username = 'Username is required.';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    }
    setFieldErrors(nextErrors);
    const firstErrorField = Object.keys(nextErrors)[0];
    if (firstErrorField) {
      focusField(firstErrorField === 'username' ? 'admin-username' : 'admin-password');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await authService.login({ username, password });
      navigate(from, { replace: true });
    } catch {
      setError('Login failed. Check your admin username and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,168,124,0.22),_transparent_35%),linear-gradient(180deg,_#faf7f2_0%,_#f5f5f4_100%)] px-6 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(28,25,23,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-stone-900 px-8 py-10 text-stone-100 sm:px-12 sm:py-14">
          <p className="text-xs uppercase tracking-[0.35em] text-primary-300">Admin access</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Operate the platform from one calm, focused workspace.</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-stone-300">
            Review lead flow, publish property updates, and manage internal access without leaving the frontend.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-5">
              <p className="text-2xl font-semibold text-primary-300">Properties</p>
              <p className="mt-2 text-sm text-stone-400">Create, edit, feature, and retire listings.</p>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-5">
              <p className="text-2xl font-semibold text-primary-300">Inquiries</p>
              <p className="mt-2 text-sm text-stone-400">Track buyer conversations and internal notes.</p>
            </div>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-12 sm:py-14">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Sign in</p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">Admin Console</h2>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-2 block text-sm font-medium text-stone-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="admin-username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFieldErrors((current) => ({ ...current, username: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.username)}
                className={`w-full rounded-2xl border bg-stone-50 px-4 py-3 text-stone-900 outline-none transition-colors ${fieldErrors.username ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-primary-500'}`}
                placeholder="Enter admin username"
                required
              />
              {fieldErrors.username && <p className="mt-2 text-sm text-red-600">{fieldErrors.username}</p>}
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-stone-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((current) => ({ ...current, password: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                className={`w-full rounded-2xl border bg-stone-50 px-4 py-3 text-stone-900 outline-none transition-colors ${fieldErrors.password ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-primary-500'}`}
                placeholder="Enter password"
                required
              />
              {fieldErrors.password && <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>}
            </div>
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary-500 px-6 py-3.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Open admin console'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}