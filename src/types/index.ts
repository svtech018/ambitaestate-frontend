export type PropertyType =
  | 'LAND_PLOTS'
  | 'HOUSES_BUNGALOWS'
  | 'APARTMENTS_FLATS'
  | 'COMMERCIAL_SHOPS'
  | 'COFFEE_ESTATES'
  | 'AGRICULTURE_LANDS'
  | 'RESORT_SPA';
export type ListingType = 'SALE' | 'RENT';
export type PropertyStatus = 'ACTIVE' | 'PENDING' | 'SOLD' | 'WITHDRAWN';
export type UserRole = 'ADMIN' | 'AGENT' | 'USER';
export type AreaUnit = 'SQFT' | 'CENTS';

export interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  area: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  yearBuilt: number;
  imageUrls: string[];
  youtubeVideoUrl: string | null;
  amenities: string[];
  featured: boolean;
  viewsCount: number;
  createdAt: string;
}

export interface PropertySearchCriteria {
  priceMin?: number;
  priceMax?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType?: PropertyType;
  listingType?: ListingType;
  areaMin?: number;
  areaMax?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  featured?: boolean;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface InquiryRequest {
  propertyId?: number;
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
  preferredContactTime?: string;
}

export interface Inquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  message: string;
  submittedAt: string;
  preferredContactTime: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
  tokenType: string;
}

export interface AdminProperty {
  id?: number;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  area: number;
  areaUnit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  yearBuilt: number;
  imageUrls: string[];
  youtubeVideoUrl: string;
  amenities: string[];
  status: PropertyStatus;
  featured: boolean;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminInquiry {
  id: number;
  propertyId: number | null;
  propertyTitle: string | null;
  name: string;
  email: string;
  phoneNumber: string | null;
  message: string;
  adminNotes: string | null;
  submittedAt: string | null;
  preferredContactTime: string | null;
  createdAt: string | null;
}

export interface AdminUser {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  role: UserRole;
  active: boolean;
}

export interface PublicContactInfo {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string | null;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export type ReviewType = 'TEXT' | 'VIDEO';

export interface Review {
  id: number;
  reviewerName: string;
  reviewerRole: string | null;
  reviewType: ReviewType;
  rating: number | null;
  reviewText: string | null;
  youtubeUrl: string | null;
}

export interface AdminReview {
  id?: number;
  reviewerName: string;
  reviewerRole: string;
  reviewType: ReviewType;
  rating: number | null;
  reviewText: string;
  youtubeUrl: string;
  showOnHomepage: boolean;
  sortOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
