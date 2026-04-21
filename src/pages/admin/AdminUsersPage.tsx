import { useEffect, useState, useCallback, type FormEvent } from 'react';
import axios from 'axios';
import { adminUserService } from '../../services/api';
import type { AdminUser, UserRole } from '../../types';
import CustomSelect from '../../components/CustomSelect';

type UserFormErrors = Partial<Record<'username' | 'email' | 'firstName' | 'lastName' | 'phoneNumber' | 'password', string>>;

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

const emptyUser: AdminUser = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  location: '',
  role: 'ADMIN',
  active: true,
};

const roles: UserRole[] = ['ADMIN', 'AGENT', 'USER'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<AdminUser>(emptyUser);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showMessage = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const updateField = <K extends keyof AdminUser>(field: K, value: AdminUser[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = (): UserFormErrors => {
    const errors: UserFormErrors = {};
    if (!form.username.trim()) errors.username = 'Username is required.';
    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (form.phoneNumber.trim() && !/^[+]?[0-9\s()-]{7,20}$/.test(form.phoneNumber.trim())) {
      errors.phoneNumber = 'Enter a valid phone number.';
    }
    if (!editingId && !(form.password ?? '').trim()) errors.password = 'Password is required.';
    return errors;
  };

  const loadUsers = async () => {
    const page = await adminUserService.getAll();
    setUsers(page.content);
  };

  useEffect(() => {
    void loadUsers().catch(() => setUsers([]));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      focusField(`user-${firstErrorField}`);
      return;
    }

    const payload = {
      ...form,
      password: form.password || undefined,
    };

    try {
      if (editingId) {
        await adminUserService.update(editingId, payload);
        showMessage('User updated successfully.');
      } else {
        await adminUserService.create(payload);
        showMessage('User created successfully.');
      }

      setEditingId(null);
      setForm(emptyUser);
      setFieldErrors({});
      await loadUsers();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as { message?: string } | undefined)?.message;
        showMessage(msg ?? 'Unable to save user. Please try again.', 'error');
      } else {
        showMessage('Unable to save user. Please try again.', 'error');
      }
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id ?? null);
    setForm({
      ...user,
      password: '',
      phoneNumber: user.phoneNumber ?? '',
      location: user.location ?? '',
      active: user.active ?? true,
    });
    setFieldErrors({});
  };

  const removeUser = async (id?: number) => {
    if (!id) return;
    await adminUserService.remove(id);
    await loadUsers();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm shadow-stone-200/60">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Access control</p>
        <h1 className="mt-3 font-serif text-4xl">Manage users</h1>

        {message && (
          <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Username <span className="text-red-500">*</span></span>
            <input id="user-username" value={form.username} onChange={(e) => updateField('username', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.username ? 'border-red-400' : 'border-stone-300'}`} placeholder="Username" required />
            {fieldErrors.username && <p className="mt-2 text-sm text-red-600">{fieldErrors.username}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Email <span className="text-red-500">*</span></span>
            <input id="user-email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.email ? 'border-red-400' : 'border-stone-300'}`} placeholder="Email" type="email" required />
            {fieldErrors.email && <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">First name <span className="text-red-500">*</span></span>
            <input id="user-firstName" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.firstName ? 'border-red-400' : 'border-stone-300'}`} placeholder="First name" required />
            {fieldErrors.firstName && <p className="mt-2 text-sm text-red-600">{fieldErrors.firstName}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Last name <span className="text-red-500">*</span></span>
            <input id="user-lastName" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.lastName ? 'border-red-400' : 'border-stone-300'}`} placeholder="Last name" required />
            {fieldErrors.lastName && <p className="mt-2 text-sm text-red-600">{fieldErrors.lastName}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Phone number</span>
            <input id="user-phoneNumber" value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.phoneNumber ? 'border-red-400' : 'border-stone-300'}`} placeholder="Phone number" />
            {fieldErrors.phoneNumber && <p className="mt-2 text-sm text-red-600">{fieldErrors.phoneNumber}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Location</span>
            <input id="user-location" value={form.location ?? ''} onChange={(e) => updateField('location', e.target.value)} className="w-full rounded-2xl border border-stone-300 px-4 py-3" placeholder="e.g. Mumbai, India" />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">{editingId ? 'New password' : 'Password'} {!editingId && <span className="text-red-500">*</span>}</span>
            <input id="user-password" value={form.password ?? ''} onChange={(e) => updateField('password', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.password ? 'border-red-400' : 'border-stone-300'}`} placeholder={editingId ? 'New password (optional)' : 'Password'} type="password" required={!editingId} />
            {fieldErrors.password && <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>}
          </label>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-2 block">Role</span>
            <CustomSelect
              value={form.role}
              options={roles.map((role) => ({ label: role, value: role }))}
              onChange={(value) => updateField('role', value as UserRole)}
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-700">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            User is active
          </label>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-stone-950">
              {editingId ? 'Update user' : 'Create user'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyUser); setFieldErrors({}); }} className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700">
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-sm shadow-stone-200/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr>
                <th className="pb-4">Name</th>
                <th className="pb-4">Username</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 font-medium">{user.firstName} {user.lastName}</td>
                  <td className="py-4 text-stone-600">@{user.username}</td>
                  <td className="py-4 text-stone-600">{user.role}</td>
                  <td className="py-4 text-stone-600">{user.active ? 'Active' : 'Inactive'}</td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button type="button" onClick={() => startEdit(user)} className="text-primary-700">Edit</button>
                      <button type="button" onClick={() => void removeUser(user.id)} className="text-red-700">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}