import type {
  DevelopmentProjectStatus,
  DevelopmentUnitStatus,
  DevelopmentTrackingStatus,
} from '../types/development';

// ── Project Status ───────────────────────────────────────────────────────

export const DEVELOPMENT_PROJECT_STATUS_OPTIONS: DevelopmentProjectStatus[] = [
  'Planned',
  'UnderConstruction',
  'NearCompletion',
  'Completed',
  'OnHold',
];

const PROJECT_TONES: Record<DevelopmentProjectStatus, 'info' | 'forest' | 'success' | 'gold'> = {
  Planned: 'info',
  UnderConstruction: 'forest',
  NearCompletion: 'info',
  Completed: 'success',
  OnHold: 'gold',
};

const PROJECT_LABELS: Record<DevelopmentProjectStatus, string> = {
  Planned: 'Planned',
  UnderConstruction: 'Under Construction',
  NearCompletion: 'Near Completion',
  Completed: 'Completed',
  OnHold: 'On Hold',
};

export function developmentStatusTone(status: string): 'info' | 'forest' | 'success' | 'gold' | 'neutral' {
  return PROJECT_TONES[status as DevelopmentProjectStatus] ?? 'neutral';
}

export function developmentStatusLabel(status: string): string {
  return PROJECT_LABELS[status as DevelopmentProjectStatus] ?? status;
}

// ── Unit Status ──────────────────────────────────────────────────────────

export const DEVELOPMENT_UNIT_STATUS_OPTIONS: DevelopmentUnitStatus[] = [
  'Available',
  'Reserved',
  'Sold',
  'UnderConstruction',
];

const UNIT_TONES: Record<DevelopmentUnitStatus, 'forest' | 'gold' | 'info' | 'neutral'> = {
  Available: 'forest',
  Reserved: 'gold',
  Sold: 'neutral',
  UnderConstruction: 'info',
};

const UNIT_LABELS: Record<DevelopmentUnitStatus, string> = {
  Available: 'Available',
  Reserved: 'Reserved',
  Sold: 'Sold',
  UnderConstruction: 'Under Construction',
};

export function unitStatusTone(status: string): 'forest' | 'gold' | 'info' | 'neutral' {
  return UNIT_TONES[status as DevelopmentUnitStatus] ?? 'neutral';
}

export function unitStatusLabel(status: string): string {
  return UNIT_LABELS[status as DevelopmentUnitStatus] ?? status;
}

// ── Tracking Status ──────────────────────────────────────────────────────

export const DEVELOPMENT_TRACKING_STATUS_OPTIONS: DevelopmentTrackingStatus[] = [
  'Tracking',
  'Interested',
  'Contacted',
];

const TRACKING_TONES: Record<DevelopmentTrackingStatus, 'forest' | 'gold' | 'info'> = {
  Tracking: 'forest',
  Interested: 'gold',
  Contacted: 'info',
};

const TRACKING_LABELS: Record<DevelopmentTrackingStatus, string> = {
  Tracking: 'Tracking',
  Interested: 'Interested',
  Contacted: 'Contacted',
};

export function trackingStatusTone(status: string): 'forest' | 'gold' | 'info' | 'neutral' {
  return TRACKING_TONES[status as DevelopmentTrackingStatus] ?? 'neutral';
}

export function trackingStatusLabel(status: string): string {
  return TRACKING_LABELS[status as DevelopmentTrackingStatus] ?? status;
}
