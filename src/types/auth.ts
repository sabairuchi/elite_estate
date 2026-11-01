export type UserRole = 'buyer' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  agencyName?: string;    // Applicable for Agent / Seller
  licenseNumber?: string; // Applicable for Agent / Seller
  bio?: string;
  officeAddress?: string;
  workingHours?: string; // e.g. "Mon - Fri: 9:00 AM - 7:00 PM | Sat: 10:00 AM - 4:00 PM"
  availabilitySlots?: string[]; // e.g. ["Morning (9am - 12pm)", "Afternoon (1pm - 5pm)", "Evening (5pm - 8pm)", "Weekends"]
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp' | 'any';
  languages?: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface StoredUserRecord extends User {
  passwordHash: string;
  passwordSalt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number; // Unix timestamp (ms)
}

export interface PasswordResetToken {
  token: string;
  email: string;
  userId: string;
  expiresAt: number; // Unix timestamp (ms)
  used: boolean;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'pending' | 'contacted' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled';

export interface InquiryNote {
  id: string;
  text: string;
  createdAt: string;
  authorName: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  agentId?: string; // Target agent
  type: 'tour' | 'inquiry';
  name: string;
  email: string;
  phone: string;
  date?: string;
  timeSlot?: string;
  message?: string;
  status: InquiryStatus;
  notes?: InquiryNote[];
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

