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
  propertyCount: number;
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
  enquiryCount: number;
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

export type EnquiryStatus = 'Pending' | 'InProgress' | 'ViewingScheduled' | 'Resolved';

export interface Enquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: EnquiryStatus;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  userId: string | null;
  agentId: number;
  agentName: string;
  agentReadAt: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AgentEnquirySummary {
  agentId: number;
  agentName: string;
  totalEnquiries: number;
  unreadEnquiries: number;
  latestEnquiryAt: string | null;
}

export interface AgentNotifyResult {
  enquiryId: number;
  enquiryStatus: string;
  clientFullName: string;
  clientEmail: string;
  clientPhone: string | null;
  clientMessage: string;
  agentId: number;
  agentName: string;
  agentEmail: string;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  agentReadAt: string | null;
}

export interface ConversationClient {
  userId: string;
  fullName: string;
  email: string;
}

export interface ConversationAgent {
  agentId: number;
  fullName: string;
  agencyName: string;
  photoUrl: string | null;
}

export interface ConversationProperty {
  propertyId: number;
  title: string;
  slug: string;
}

export interface Conversation {
  id: number;
  enquiryId: number;
  client: ConversationClient;
  agent: ConversationAgent;
  property: ConversationProperty;
  lastMessageAt: string | null;
  messageCount: number;
  unreadCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Message {
  id: number;
  conversationId: number;
  senderUserId: string;
  senderName: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
}

export interface EnquiryConversationState {
  enquiryId: number;
  conversation: Conversation | null;
  client: ConversationClient;
  agent: ConversationAgent;
  property: ConversationProperty;
}

export interface FirstMessageResult {
  conversation: Conversation;
  message: Message;
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
  agentId: number | null;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
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

export type DashboardData = AdminDashboard | AgentDashboard | ClientDashboard;

export interface AdminDashboard {
  totalProperties: number;
  totalAgents: number;
  totalEnquiries: number;
  totalUsers: number;
  recentProperties: Property[];
  recentEnquiries: Enquiry[];
}

export interface AgentDashboard {
  agent: Agent;
  totalProperties: number;
  recentProperties: Property[];
  totalEnquiries: number;
  pendingEnquiries: number;
  recentEnquiries: Enquiry[];
}

export interface ClientDashboard {
  profile: AuthUser;
  totalSavedProperties: number;
  savedProperties: Property[];
  totalEnquiries: number;
  pendingEnquiries: number;
  recentEnquiries: Enquiry[];
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
