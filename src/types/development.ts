// Types mirror the ASP.NET Core backend DTOs under /api/development-*.

import type { Paginated } from './index';

export type DevelopmentProjectStatus = 'Planned' | 'UnderConstruction' | 'NearCompletion' | 'Completed' | 'OnHold';

export type DevelopmentUnitStatus = 'Available' | 'Reserved' | 'Sold' | 'UnderConstruction';

export type DevelopmentTrackingStatus = 'Tracking' | 'Interested' | 'Contacted';

// ── Response DTOs ──────────────────────────────────────────────────────────

export interface DevelopmentProjectImage {
  id: number;
  url: string;
  publicId: string;
  isCover: boolean;
  displayOrder: number;
}

export interface DevelopmentProject {
  id: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  locationRefId: number | null;
  developer: string | null;
  status: DevelopmentProjectStatus;
  expectedCompletionDate: string | null;
  progressPercentage: number;
  featured: boolean;
  images: DevelopmentProjectImage[];
  unitCount: number;
  updateCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface DevelopmentProjectDetail extends DevelopmentProject {
  units: DevelopmentUnit[];
  updates: DevelopmentUpdate[];
}

export interface DevelopmentUnit {
  id: number;
  unitIdentifier: string;
  unitType: string;
  status: DevelopmentUnitStatus;
  price: number | null;
  currency: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface DevelopmentUpdate {
  id: number;
  title: string;
  description: string;
  progressPercentage: number | null;
  updateDate: string;
  imageUrls: string[];
  imagePublicIds: string[];
  createdAt: string;
  updatedAt: string | null;
}

export interface DevelopmentTracking {
  id: number;
  developmentProjectId: number;
  developmentProjectName: string;
  developmentUnitId: number | null;
  developmentUnitIdentifier: string | null;
  status: DevelopmentTrackingStatus;
  trackedAt: string;
}

export interface AdminDevelopmentTracking extends DevelopmentTracking {
  userId: string;
  userFullName: string;
  userEmail: string;
}

// ── Query / Filter params ──────────────────────────────────────────────────

export interface DevelopmentProjectFilters {
  keyword?: string;
  status?: DevelopmentProjectStatus;
  featured?: boolean;
  locationId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface DevelopmentTrackingFilters {
  projectId?: number;
  userId?: string;
  pageNumber?: number;
  pageSize?: number;
}

// ── Paginated re-exports ───────────────────────────────────────────────────

export type PaginatedDevelopmentProjects = Paginated<DevelopmentProject>;
export type PaginatedDevelopmentTracking = Paginated<DevelopmentTracking>;
export type PaginatedAdminDevelopmentTracking = Paginated<AdminDevelopmentTracking>;
