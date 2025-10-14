// Waitlist Types
export interface WaitlistMetadata {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  userAgent?: string;
  ipCountry?: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: 'pending' | 'invited' | 'converted';
  metadata: WaitlistMetadata;
  createdAt: Date;
  invitedAt: Date | null;
  convertedAt: Date | null;
}

export interface WaitlistFormData {
  email: string;
  name?: string;
}

export interface WaitlistActionResponse {
  success: boolean;
  message: string;
  isExisting?: boolean;
  count?: number;
}
