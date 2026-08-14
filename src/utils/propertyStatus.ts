import type { PropertyStatus } from '../types';

const DISPLAY_LABELS: Partial<Record<PropertyStatus, string>> = {
  'For Lease': 'For Rent',
};

export function propertyStatusLabel(status: PropertyStatus): string {
  return DISPLAY_LABELS[status] ?? status;
}
