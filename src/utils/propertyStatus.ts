import type { PropertyStatus } from '../types';

export const PROPERTY_STATUSES: PropertyStatus[] = [
  'Available',
  'Pending',
  'Sold',
  'Rented',
  'Unavailable',
];

const DISPLAY_LABELS: Record<PropertyStatus, string> = {
  Available: 'Available',
  Pending: 'Pending',
  Sold: 'Sold',
  Rented: 'Rented',
  Unavailable: 'Unavailable',
};

export function propertyStatusLabel(status: PropertyStatus): string {
  return DISPLAY_LABELS[status] ?? status;
}

export function listingTypeLabel(listingType: string): string {
  if (listingType === 'ForLease') return 'For Rent';
  if (listingType === 'ForSale') return 'For Sale';
  return listingType;
}
