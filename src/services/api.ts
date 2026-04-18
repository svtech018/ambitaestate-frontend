import axios from 'axios';
import type {
  AdminInquiry,
  AdminProperty,
  AdminUser,
  ApiResponse,
  AuthTokenResponse,
  LoginRequest,
  Page,
  Property,
  PropertySearchCriteria,
  InquiryRequest,
  Inquiry,
  AdminReview,
  Review,
  PublicContactInfo,
} from '../types';

// Use cookies for auth (httpOnly) — do NOT store tokens in localStorage.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies and accept cookie-based sessions
});

// Emit unauthorized events when server responds 401 so UI can react
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login endpoint should set a secure httpOnly cookie containing the session/token.
  async login(credentials: LoginRequest): Promise<AuthTokenResponse> {
    const { data } = await api.post<ApiResponse<AuthTokenResponse>>(
      '/auth/login',
      credentials
    );
    // Server is expected to set an httpOnly cookie. Return any non-sensitive user info.
    return data.data;
  },

  async check(): Promise<boolean> {
    try {
      await api.get('/auth/me');
      return true;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};

export const propertyService = {
  async getAll(criteria: PropertySearchCriteria = {}): Promise<Page<Property>> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await api.get<ApiResponse<Page<Property>>>(
      `/properties?${params.toString()}`
    );
    if (!data.success || data.data == null) {
      throw new Error(data.message || 'Failed to load properties');
    }
    return data.data;
  },

  async getById(id: number): Promise<Property> {
    const { data } = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return data.data;
  },

  async getFeatured(): Promise<Page<Property>> {
    const { data } = await api.get<ApiResponse<Page<Property>>>(
      '/properties/featured?size=6'
    );
    return data.data;
  },

  async getRecent(size = 6): Promise<Page<Property>> {
    const { data } = await api.get<ApiResponse<Page<Property>>>(
      `/properties?sortBy=createdAt&sortDirection=desc&size=${size}`
    );
    return data.data;
  },

  async search(searchTerm: string): Promise<Page<Property>> {
    const { data } = await api.get<ApiResponse<Page<Property>>>(
      `/properties?searchTerm=${encodeURIComponent(searchTerm)}`
    );
    return data.data;
  },
};

export const inquiryService = {
  async submit(inquiry: InquiryRequest): Promise<Inquiry> {
    const { data } = await api.post<ApiResponse<Inquiry>>(
      '/inquiries',
      inquiry
    );
    return data.data;
  },
};

export const publicContactService = {
  async getContactInfo(): Promise<PublicContactInfo> {
    const { data } = await api.get<ApiResponse<PublicContactInfo>>('/contact-info');
    return data.data;
  },
};

export const adminPropertyService = {
  async getAll(page = 0, size = 20): Promise<Page<AdminProperty>> {
    const { data } = await api.get<ApiResponse<Page<AdminProperty>>>(
      `/admin/properties?page=${page}&size=${size}`
    );
    return data.data;
  },

  async getById(id: number): Promise<AdminProperty> {
    const { data } = await api.get<ApiResponse<AdminProperty>>(
      `/admin/properties/${id}`
    );
    return data.data;
  },

  async create(payload: AdminProperty): Promise<AdminProperty> {
    const { data } = await api.post<ApiResponse<AdminProperty>>(
      '/admin/properties',
      payload
    );
    return data.data;
  },

  async update(id: number, payload: AdminProperty): Promise<AdminProperty> {
    const { data } = await api.put<ApiResponse<AdminProperty>>(
      `/admin/properties/${id}`,
      payload
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/properties/${id}`);
  },
};

export const adminInquiryService = {
  async getAll(page = 0, size = 20): Promise<Page<AdminInquiry>> {
    const { data } = await api.get<ApiResponse<Page<AdminInquiry>>>(
      `/admin/inquiries?page=${page}&size=${size}`
    );
    return data.data;
  },

  async updateNotes(id: number, adminNotes: string): Promise<AdminInquiry> {
    const { data } = await api.patch<ApiResponse<AdminInquiry>>(
      `/admin/inquiries/${id}/notes?adminNotes=${encodeURIComponent(adminNotes)}`
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/inquiries/${id}`);
  },
};

export const adminUserService = {
  async getAll(page = 0, size = 20): Promise<Page<AdminUser>> {
    const { data } = await api.get<ApiResponse<Page<AdminUser>>>(
      `/admin/users?page=${page}&size=${size}`
    );
    return data.data;
  },

  async create(payload: AdminUser): Promise<AdminUser> {
    const { data } = await api.post<ApiResponse<AdminUser>>(
      '/admin/users',
      payload
    );
    return data.data;
  },

  async update(id: number, payload: AdminUser): Promise<AdminUser> {
    const { data } = await api.put<ApiResponse<AdminUser>>(
      `/admin/users/${id}`,
      payload
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};

export const adminReviewService = {
  async getAll(page = 0, size = 20): Promise<Page<AdminReview>> {
    const { data } = await api.get<ApiResponse<Page<AdminReview>>>(
      `/admin/reviews?page=${page}&size=${size}`
    );
    return data.data;
  },

  async create(payload: AdminReview): Promise<AdminReview> {
    const { data } = await api.post<ApiResponse<AdminReview>>(
      '/admin/reviews',
      payload
    );
    return data.data;
  },

  async update(id: number, payload: AdminReview): Promise<AdminReview> {
    const { data } = await api.put<ApiResponse<AdminReview>>(
      `/admin/reviews/${id}`,
      payload
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/reviews/${id}`);
  },
};

export const reviewService = {
  async getHomepageReviews(): Promise<Review[]> {
    const { data } = await api.get<ApiResponse<Review[]>>(
      '/reviews/homepage'
    );
    return data.data;
  },
};
