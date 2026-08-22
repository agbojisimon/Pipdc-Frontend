import type { EnquiryStatus } from '../types';

export const ENQUIRY_STATUS_OPTIONS: EnquiryStatus[] = ['Pending', 'InProgress', 'ViewingScheduled', 'Resolved'];

const TONES: Record<EnquiryStatus, 'gold' | 'info' | 'forest' | 'success'> = {
  Pending: 'gold',
  InProgress: 'info',
  ViewingScheduled: 'forest',
  Resolved: 'success',
};

const LABELS: Record<EnquiryStatus, string> = {
  Pending: 'Pending',
  InProgress: 'In Progress',
  ViewingScheduled: 'Viewing Scheduled',
  Resolved: 'Resolved',
};

export function enquiryStatusTone(status: string): 'gold' | 'info' | 'forest' | 'success' | 'neutral' {
  return TONES[status as EnquiryStatus] ?? 'neutral';
}

export function enquiryStatusLabel(status: string): string {
  return LABELS[status as EnquiryStatus] ?? status;
}
