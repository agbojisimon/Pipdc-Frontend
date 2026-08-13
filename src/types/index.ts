// Types mirror the ASP.NET Core backend DTOs under /api.

export type PropertyStatus = 'For Sale' | 'For Lease' | 'Sold' | 'Off Market';

export type PropertyType =
  | 'Detached House'
  | 'Semi-Detached'
  | 'Terrace'
  | 'Apartment'
  | 'Penthouse'
  | 'Villa'
  | 'Mansion'
  | 'Land'
  | 'Commercial'
  | 'Townhouse'
  | 'Residential'
  | 'Industrial'
  | 'Mixed';

export interface Agent {
  id: number;
  bio: string | null;
  title: string | null;
  photo: string | null;
  agency: string;
  licenseNumber: string | null;
  phone: string;
  verified: boolean;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  period?: string | null;
  status: PropertyStatus;
  type: PropertyType;
  propertyType: string;
  listingType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  sizeUnit: string;
  lotSize?: number | null;
  yearBuilt?: number | null;
  address: string;
  city: string;
  area?: string | null;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  coverImage?: string | null;
  amenities: string[];
  featured: boolean;
  agentId: number;
  agentName: string;
  agentPhoto?: string | null;
  isSaved: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  readMinutes: number;
}

export type EnquiryStatus = 'Pending' | 'Responded' | 'Closed';

export interface Enquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  propertyId: number;
  propertyTitle: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roles: string[];
  status: 'Active' | 'Suspended';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
}

export interface AuthResponse {
  userId: string;
  email: string;
  roles: string[];
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface SavedProperty {
  id: number;
  savedAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalAgents: number;
  totalEnquiries: number;
  totalUsers: number;
}

export interface PropertyFilters {
  query?: string;
  location?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sort?: string;
  agentId?: number;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  type?: string;
}
