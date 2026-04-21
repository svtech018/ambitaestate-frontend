import axios from 'axios';
import { useEffect, useState, type FormEvent, useCallback } from 'react';
import { adminPropertyService } from '../../services/api';
import type { AdminProperty, AreaUnit, ListingType, PropertyStatus, PropertyType } from '../../types';
import CustomSelect from '../../components/CustomSelect';

type PropertyFormErrors = Partial<Record<'title' | 'price' | 'address' | 'city' | 'state' | 'area' | 'description' | 'imageUrls' | 'zipCode' | 'bedrooms' | 'bathrooms' | 'parkingSpaces' | 'yearBuilt', string>>;

interface UploadedImageItem {
  name: string;
  size: number;
  mimeType: string;
  bytes: number[];
  previewUrl: string;
}

const emptyProperty: AdminProperty = {
  title: '',
  description: '',
  propertyType: 'HOUSES_BUNGALOWS',
  listingType: 'SALE',
  price: 0,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  area: 0,
  areaUnit: 'SQFT',
  bedrooms: 0,
  bathrooms: 0,
  parkingSpaces: 0,
  yearBuilt: new Date().getFullYear(),
  imageUrls: [],
  youtubeVideoUrl: '',
  amenities: [],
  status: 'ACTIVE',
  featured: false,
};

const propertyTypes: PropertyType[] = [
  'LAND_PLOTS',
  'HOUSES_BUNGALOWS',
  'APARTMENTS_FLATS',
  'COMMERCIAL_SHOPS',
  'COFFEE_ESTATES',
  'AGRICULTURE_LANDS',
  'RESORT_SPA',
];

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  LAND_PLOTS: 'Land/Plots',
  HOUSES_BUNGALOWS: 'Houses/Bungalows',
  APARTMENTS_FLATS: 'Apartments/Flats',
  COMMERCIAL_SHOPS: 'Commercial Shops/Spaces',
  COFFEE_ESTATES: 'Coffee Estates',
  AGRICULTURE_LANDS: 'Agriculture Lands',
  RESORT_SPA: 'Resort/Spa',
};

function showBedrooms(type: PropertyType) {
  return type === 'HOUSES_BUNGALOWS' || type === 'APARTMENTS_FLATS';
}
function showBathrooms(type: PropertyType) {
  return type === 'HOUSES_BUNGALOWS' || type === 'APARTMENTS_FLATS' || type === 'COMMERCIAL_SHOPS';
}
function showParking(type: PropertyType) {
  return type !== 'LAND_PLOTS' && type !== 'AGRICULTURE_LANDS';
}
function showYearBuilt(type: PropertyType) {
  return type !== 'LAND_PLOTS' && type !== 'AGRICULTURE_LANDS';
}
const listingTypes: ListingType[] = ['SALE', 'RENT'];
const propertyStatuses: PropertyStatus[] = ['ACTIVE', 'PENDING', 'SOLD', 'WITHDRAWN'];

function bytesToDataUrl(bytes: number[], mimeType: string): string {
  let binary = '';
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return `data:${mimeType};base64,${btoa(binary)}`;
}

async function fileToUploadedImage(file: File): Promise<UploadedImageItem> {
  const buffer = await file.arrayBuffer();
  const bytes = Array.from(new Uint8Array(buffer));
  return {
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    bytes,
    previewUrl: bytesToDataUrl(bytes, file.type || 'application/octet-stream'),
  };
}

function getNumberInputValue(value: number | undefined): string {
  if (value === undefined || value === null || value === 0) {
    return '';
  }
  return String(value);
}

function parseNumberInput(value: string): number {
  if (value.trim() === '') {
    return 0;
  }
  return Number(value);
}

function focusField(fieldId: string) {
  const element = document.getElementById(fieldId);
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  }
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [form, setForm] = useState<AdminProperty>(emptyProperty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [fieldErrors, setFieldErrors] = useState<PropertyFormErrors>({});

  const updateField = <K extends keyof AdminProperty>(field: K, value: AdminProperty[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = (): PropertyFormErrors => {
    const errors: PropertyFormErrors = {};

    if (!form.title.trim()) errors.title = 'Title is required.';
    if (form.price <= 0) errors.price = 'Price must be greater than 0.';
    if (!form.address.trim()) errors.address = 'Address is required.';
    if (!form.city.trim()) errors.city = 'City is required.';
    if (!form.state.trim()) errors.state = 'State is required.';
    if (form.area <= 0) errors.area = 'Area must be greater than 0.';
    if (!form.description.trim()) errors.description = 'Description is required.';
    if (uploadedImages.length === 0) errors.imageUrls = 'At least one property image is required.';

    return errors;
  };

  const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  const loadProperties = async () => {
    const page = await adminPropertyService.getAll();
    setProperties(page.content);
  };

  useEffect(() => {
    void loadProperties().catch(() => setProperties([]));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      focusField(firstErrorField === 'imageUrls' ? 'property-image-upload' : `property-${firstErrorField}`);
      return;
    }

    const payload: AdminProperty = {
      ...form,
      imageUrls: form.imageUrls.filter(Boolean),
      amenities: form.amenities.filter(Boolean),
    };

    try {
      if (editingId) {
        await adminPropertyService.update(editingId, payload);
        showMessage('Property updated successfully.');
      } else {
        await adminPropertyService.create(payload);
        showMessage('Property created successfully.');
      }

      setForm(emptyProperty);
      setEditingId(null);
      setIsFormOpen(false);
      setUploadedImages([]);
      setFieldErrors({});
      await loadProperties();
    } catch (error) {
      // 401 is handled globally by the api interceptor (redirects to /admin/login)
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as { success?: boolean; message?: string; data?: unknown } | undefined;
        const fieldData = responseData?.data;
        if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
          // Backend returned field-level validation errors (400 from @Valid or ConstraintViolation)
          const fieldMap: Record<string, keyof PropertyFormErrors> = {
            title: 'title',
            price: 'price',
            address: 'address',
            city: 'city',
            state: 'state',
            area: 'area',
            description: 'description',
            zipCode: 'zipCode',
            bedrooms: 'bedrooms',
            bathrooms: 'bathrooms',
            parkingSpaces: 'parkingSpaces',
            yearBuilt: 'yearBuilt',
          };
          const apiErrors: PropertyFormErrors = {};
          let hasFieldErrors = false;
          Object.entries(fieldData as Record<string, unknown>).forEach(([rawKey, msg]) => {
            // property path may be "createProperty.dto.zipCode" — take last segment
            const key = rawKey.includes('.') ? rawKey.split('.').pop()! : rawKey;
            const mapped = fieldMap[key];
            if (mapped && typeof msg === 'string') {
              apiErrors[mapped] = msg;
              hasFieldErrors = true;
            }
          });
          if (hasFieldErrors) {
            setFieldErrors(apiErrors);
            showMessage(responseData?.message ?? 'Please fix the highlighted fields and try again.');
            return;
          }
        }
        showMessage(responseData?.message ?? 'Unable to save property right now.');
      } else {
        showMessage('Unable to save property right now.');
      }
    }
  };

  const startEdit = (property: AdminProperty) => {
    setEditingId(property.id ?? null);
    setForm({
      ...property,
      imageUrls: property.imageUrls ?? [],
      amenities: property.amenities ?? [],
      youtubeVideoUrl: property.youtubeVideoUrl ?? '',
      zipCode: property.zipCode ?? '',
      area: property.area ?? 0,
      areaUnit: property.areaUnit ?? 'SQFT',
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      parkingSpaces: property.parkingSpaces ?? 0,
      yearBuilt: property.yearBuilt ?? new Date().getFullYear(),
      description: property.description ?? '',
    });
    setUploadedImages(
      (property.imageUrls ?? []).map((imageUrl, index) => ({
        name: `image-${index + 1}`,
        size: 0,
        mimeType: imageUrl.startsWith('data:')
          ? imageUrl.slice(5, imageUrl.indexOf(';')) || 'image/*'
          : 'image/*',
        bytes: [],
        previewUrl: imageUrl,
      }))
    );
    setFieldErrors({});
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markAsSold = async (property: AdminProperty) => {
    if (!property.id) return;
    await adminPropertyService.update(property.id, { ...property, status: 'SOLD' });
    showMessage(`"${property.title}" marked as sold.`);
    await loadProperties();
  };

  const removeProperty = async (id?: number) => {
    if (!id) return;
    try {
      await adminPropertyService.remove(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyProperty);
        setIsFormOpen(false);
        setUploadedImages([]);
      }
      showMessage('Property deleted successfully.');
      await loadProperties();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as { message?: string } | undefined)?.message;
        showMessage(msg ?? 'Unable to delete property. Please try again.', 'error');
      } else {
        showMessage('Unable to delete property. Please try again.', 'error');
      }
    }
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages((current) => {
      const next = current.filter((_, index) => index !== indexToRemove);
      setForm((existing) => ({
        ...existing,
        imageUrls: next.map((item) => item.previewUrl),
      }));
      return next;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const convertedFiles = await Promise.all(files.map(fileToUploadedImage));
    setUploadedImages((current) => {
      const next = [...current, ...convertedFiles];
      setForm((existing) => ({
        ...existing,
        imageUrls: next.map((item) => item.previewUrl),
      }));
      setFieldErrors((existing) => ({ ...existing, imageUrls: undefined }));
      return next;
    });

    event.target.value = '';
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Listings</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900">Manage Properties</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {message && (
              <p className={`rounded-full px-4 py-2 text-sm font-medium ${
                messageType === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setIsFormOpen((current) => {
                  const next = !current;
                  if (!next) {
                    setEditingId(null);
                    setForm(emptyProperty);
                    setUploadedImages([]);
                    setFieldErrors({});
                  }
                  return next;
                });
              }}
              className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-primary-400"
            >
              {isFormOpen ? 'Close form' : '+ Add Property'}
            </button>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-stone-200 py-16 text-center">
            <p className="text-lg font-medium text-stone-400">No properties yet</p>
            <p className="mt-1 text-sm text-stone-400">Click &quot;+ Add Property&quot; to create your first listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Featured</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((property) => (
                  <tr key={property.id} className="transition-colors hover:bg-stone-50">
                    <td className="px-4 py-3.5 font-medium text-stone-900">{property.title}</td>
                    <td className="px-4 py-3.5 text-stone-600">
                      <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">{property.listingType}</span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">{property.city}, {property.state}</td>
                    <td className="px-4 py-3.5 font-medium text-stone-900">&#8377;{property.price?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        property.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                        property.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        property.status === 'SOLD' ? 'bg-blue-50 text-blue-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>{property.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {property.featured ? (
                        <span className="inline-flex items-center gap-1 text-primary-600"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Yes</span>
                      ) : <span className="text-stone-400">No</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => startEdit(property)} className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100">Edit</button>
                        {property.status !== 'SOLD' && (
                          <button type="button" onClick={() => void markAsSold(property)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100">Mark Sold</button>
                        )}
                        <button type="button" onClick={() => void removeProperty(property.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isFormOpen && (
        <section className="rounded-2xl bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Property form</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-stone-900">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Title <span className="text-red-500">*</span></span>
              <input id="property-title" value={form.title} onChange={(e) => updateField('title', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.title ? 'border-red-400' : 'border-stone-300'}`} required />
              {fieldErrors.title && <p className="mt-2 text-sm text-red-600">{fieldErrors.title}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Price <span className="text-red-500">*</span></span>
              <input id="property-price" value={getNumberInputValue(form.price)} onChange={(e) => updateField('price', parseNumberInput(e.target.value))} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.price ? 'border-red-400' : 'border-stone-300'}`} type="number" min="0" step="0.01" required />
              {fieldErrors.price && <p className="mt-2 text-sm text-red-600">{fieldErrors.price}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Property type</span>
              <CustomSelect
                value={form.propertyType}
                options={propertyTypes.map((type) => ({ label: PROPERTY_TYPE_LABELS[type], value: type }))}
                onChange={(value) => setForm({ ...form, propertyType: value as PropertyType })}
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Listing type</span>
              <CustomSelect
                value={form.listingType}
                options={listingTypes.map((type) => ({ label: type, value: type }))}
                onChange={(value) => setForm({ ...form, listingType: value as ListingType })}
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              <span className="mb-2 block">Address <span className="text-red-500">*</span></span>
              <input id="property-address" value={form.address} onChange={(e) => updateField('address', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.address ? 'border-red-400' : 'border-stone-300'}`} required />
              {fieldErrors.address && <p className="mt-2 text-sm text-red-600">{fieldErrors.address}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">City <span className="text-red-500">*</span></span>
              <input id="property-city" value={form.city} onChange={(e) => updateField('city', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.city ? 'border-red-400' : 'border-stone-300'}`} required />
              {fieldErrors.city && <p className="mt-2 text-sm text-red-600">{fieldErrors.city}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">State <span className="text-red-500">*</span></span>
              <input id="property-state" value={form.state} onChange={(e) => updateField('state', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.state ? 'border-red-400' : 'border-stone-300'}`} required />
              {fieldErrors.state && <p className="mt-2 text-sm text-red-600">{fieldErrors.state}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">ZIP code</span>
              <input id="property-zipCode" value={form.zipCode} onChange={(e) => { setForm((f) => ({ ...f, zipCode: e.target.value })); setFieldErrors((fe) => ({ ...fe, zipCode: undefined })); }} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.zipCode ? 'border-red-400' : 'border-stone-300'}`} />
              {fieldErrors.zipCode && <p className="mt-2 text-sm text-red-600">{fieldErrors.zipCode}</p>}
            </label>
            <label className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Status</span>
              <CustomSelect
                value={form.status}
                options={propertyStatuses.map((status) => ({ label: status, value: status }))}
                onChange={(value) => setForm({ ...form, status: value as PropertyStatus })}
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              <span className="mb-2 block">Area <span className="text-red-500">*</span></span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <input id="property-area" value={getNumberInputValue(form.area)} onChange={(e) => updateField('area', parseNumberInput(e.target.value))} className={`w-full rounded-2xl border px-4 py-3 ${fieldErrors.area ? 'border-red-400' : 'border-stone-300'}`} type="number" min="0" step="0.01" />
                </div>
                <div>
                  <CustomSelect
                    value={form.areaUnit}
                    options={[{ label: 'Sq.ft', value: 'SQFT' }, { label: 'Cents', value: 'CENTS' }]}
                    onChange={(value) => updateField('areaUnit', value as AreaUnit)}
                  />
                </div>
              </div>
              {fieldErrors.area && <p className="mt-2 text-sm text-red-600">{fieldErrors.area}</p>}
            </label>
            {showBedrooms(form.propertyType) && (
              <label className="block text-sm font-medium text-stone-700">
                <span className="mb-2 block">Bedrooms</span>
                <input value={getNumberInputValue(form.bedrooms)} onChange={(e) => setForm({ ...form, bedrooms: parseNumberInput(e.target.value) })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" type="number" min="0" />
              </label>
            )}
            {showBathrooms(form.propertyType) && (
              <label className="block text-sm font-medium text-stone-700">
                <span className="mb-2 block">Bathrooms</span>
                <input value={getNumberInputValue(form.bathrooms)} onChange={(e) => setForm({ ...form, bathrooms: parseNumberInput(e.target.value) })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" type="number" min="0" />
              </label>
            )}
            {showParking(form.propertyType) && (
              <label className="block text-sm font-medium text-stone-700">
                <span className="mb-2 block">Parking spaces</span>
                <input value={getNumberInputValue(form.parkingSpaces)} onChange={(e) => setForm({ ...form, parkingSpaces: parseNumberInput(e.target.value) })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" type="number" min="0" />
              </label>
            )}
            {showYearBuilt(form.propertyType) && (
              <label className="block text-sm font-medium text-stone-700">
                <span className="mb-2 block">Year built</span>
                <input value={getNumberInputValue(form.yearBuilt)} onChange={(e) => setForm({ ...form, yearBuilt: parseNumberInput(e.target.value) })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" type="number" min="1800" />
              </label>
            )}
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              <span className="mb-2 block">YouTube URL</span>
              <input value={form.youtubeVideoUrl} onChange={(e) => setForm({ ...form, youtubeVideoUrl: e.target.value })} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              <span className="mb-2 block">Description <span className="text-red-500">*</span></span>
              <textarea id="property-description" value={form.description} onChange={(e) => updateField('description', e.target.value)} className={`min-h-32 w-full rounded-2xl border px-4 py-3 ${fieldErrors.description ? 'border-red-400' : 'border-stone-300'}`} />
              {fieldErrors.description && <p className="mt-2 text-sm text-red-600">{fieldErrors.description}</p>}
            </label>
            <div className="block text-sm font-medium text-stone-700">
              <span className="mb-2 block">Property images <span className="text-red-500">*</span></span>
              <label id="property-image-upload" tabIndex={-1} className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-stone-50 px-4 py-6 text-center transition-colors hover:border-primary-500 hover:bg-primary-50/40 ${fieldErrors.imageUrls ? 'border-red-400' : 'border-stone-300'}`}>
                <span className="text-sm font-medium text-stone-800">Upload image files</span>
                <span className="mt-2 text-xs text-stone-500">Each file is converted to a byte array in the browser, then reconstructed into a previewable image.</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
              </label>
              {fieldErrors.imageUrls && <p className="mt-2 text-sm text-red-600">{fieldErrors.imageUrls}</p>}
              {uploadedImages.length > 0 && (
                <div className="mt-4 space-y-3">
                  {uploadedImages.map((image, index) => (
                    <div key={`${image.name}-${index}`} className="rounded-2xl border border-stone-200 p-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-900">{image.name}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {image.mimeType} · {image.size > 0 ? `${Math.round(image.size / 1024)} KB` : 'Existing image'} · {image.bytes.length > 0 ? `${image.bytes.length} bytes` : 'Stored image URL'}
                          </p>
                        </div>
                        <button type="button" onClick={() => removeUploadedImage(index)} className="text-xs font-semibold text-red-700">
                          Remove
                        </button>
                      </div>
                      <img src={image.previewUrl} alt={image.name} className="mt-3 h-28 w-full rounded-2xl object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              <span className="mb-2 block">Amenities</span>
              <div className="rounded-2xl border border-stone-300 px-4 py-3 space-y-3">
                <input 
                  placeholder="Enter amenity and press Enter (e.g., Pool, Parking Club, etc.)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      const newAmenity = e.currentTarget.value.trim();
                      if (!form.amenities.includes(newAmenity)) {
                        setForm((f) => ({
                          ...f,
                          amenities: [...f.amenities, newAmenity],
                        }));
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full border-0 bg-transparent px-0 py-0 text-sm focus:outline-none focus:ring-0"
                />
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200">
                    {form.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-sm text-primary-700"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((f) => ({
                              ...f,
                              amenities: f.amenities.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="ml-1 hover:text-primary-900 font-semibold"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-stone-300 px-4 py-4 text-sm font-medium text-stone-700 md:col-span-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Feature this property on the public site
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-stone-950">
                {editingId ? 'Update property' : 'Create property'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyProperty);
                  setIsFormOpen(false);
                  setUploadedImages([]);
                  setFieldErrors({});
                }}
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}