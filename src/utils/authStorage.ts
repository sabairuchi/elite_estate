import type { StoredUserRecord, User, PasswordResetToken, Inquiry, InquiryStatus } from '../types/auth';
import { hashPassword, verifyPassword, generateJWT, verifyJWT, generateSecureResetToken } from './crypto';

const USERS_KEY = 'elite_estate_users';
const TOKEN_KEY = 'elite_estate_token';
const RESETS_KEY = 'elite_estate_resets';
const INQUIRIES_KEY = 'elite_estate_inquiries';

// Initial Seed Users (Pre-hashed for fast startup)
// Initial Seed Users (Pre-hashed for fast startup)
const INITIAL_DEMO_USERS = [
  {
    id: 'user-buyer-001',
    name: 'Alexander Sterling',
    email: 'buyer@eliteestate.com',
    phone: '+1 (416) 555-0144',
    role: 'buyer' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Luxury real estate connoisseur seeking prime metropolitan suites.',
    createdAt: '2026-01-15T09:30:00.000Z',
    // Pre-hashed for 'EliteBuyer2026!'
    passwordSalt: '8a3b5c7d9e1f2a3b',
    passwordHash: '' // Calculated dynamically on seed init
  },
  {
    id: 'user-agent-001',
    name: 'Victoria Vance',
    email: 'agent@eliteestate.com',
    phone: '+1 (416) 555-0199',
    role: 'agent' as const,
    agencyName: 'Elite Sovereign Properties Ltd.',
    licenseNumber: 'RECO-ON-984210',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Senior Luxury Real Estate Broker specializing in Yorkville & Waterfront penthouses with over 12 years of premier advisory experience.',
    officeAddress: '100 Sovereign Way, Suite 4800, Toronto, ON M5H 2N2',
    workingHours: 'Mon - Fri: 8:30 AM - 7:00 PM | Sat: 10:00 AM - 4:00 PM',
    availabilitySlots: ['Morning (9am - 12pm)', 'Afternoon (1pm - 5pm)', 'Evening (5pm - 8pm)', 'Weekends'],
    preferredContactMethod: 'phone' as const,
    languages: ['English', 'French', 'Italian'],
    createdAt: '2025-11-10T14:20:00.000Z',
    // Pre-hashed for 'EliteAgent2026!'
    passwordSalt: '7f9e8d6c5b4a3f2e',
    passwordHash: '' // Calculated dynamically on seed init
  }
];

// Initial Seed Inquiries
const INITIAL_DEMO_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-demo-1',
    propertyId: 'prop-1',
    propertyTitle: 'Skyline Residences',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    agentId: 'user-agent-001',
    type: 'tour',
    name: 'Alexander Sterling',
    email: 'buyer@eliteestate.com',
    phone: '+1 (416) 555-0144',
    date: '2026-08-28',
    timeSlot: 'afternoon',
    message: 'Requesting a private VIP viewing with architectural walkthrough of Skyline Residences.',
    status: 'confirmed',
    notes: [
      {
        id: 'note-1',
        text: 'Spoke with Alexander regarding 2-year lease terms. Client is pre-qualified.',
        createdAt: '2026-08-20T15:30:00.000Z',
        authorName: 'Victoria Vance'
      }
    ],
    createdAt: '2026-08-20T14:15:00.000Z',
    userId: 'user-buyer-001'
  },
  {
    id: 'inq-demo-2',
    propertyId: 'prop-2',
    propertyTitle: 'Maple Heights',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    agentId: 'user-agent-001',
    type: 'tour',
    name: 'Alexander Sterling',
    email: 'buyer@eliteestate.com',
    phone: '+1 (416) 555-0144',
    date: '2026-08-30',
    timeSlot: 'morning',
    message: 'Interested in evaluating rooftop terrace and smart automation features.',
    status: 'in_progress',
    notes: [
      {
        id: 'note-2',
        text: 'Sent building bylaws and parking space options via email.',
        createdAt: '2026-08-21T12:00:00.000Z',
        authorName: 'Victoria Vance'
      }
    ],
    createdAt: '2026-08-21T11:00:00.000Z',
    userId: 'user-buyer-001'
  },
  {
    id: 'inq-demo-3',
    propertyId: 'prop-3',
    propertyTitle: 'Harbour View Apartments',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    agentId: 'user-agent-001',
    type: 'inquiry',
    name: 'Michael Henderson',
    email: 'm.henderson@example.com',
    phone: '+1 (416) 555-0812',
    message: 'Inquiring about private parking garage options and executive relocation timeline.',
    status: 'new',
    notes: [],
    createdAt: '2026-08-22T08:45:00.000Z'
  }
];

/**
 * Ensures initial seed users exist in database
 */
export async function initializeAuthDatabase(): Promise<void> {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    const seededUsers: StoredUserRecord[] = [];
    
    // Hash passwords for initial accounts
    const buyerHash = await hashPassword('EliteBuyer2026!', INITIAL_DEMO_USERS[0].passwordSalt);
    seededUsers.push({
      ...INITIAL_DEMO_USERS[0],
      passwordHash: buyerHash.hash
    });

    const agentHash = await hashPassword('EliteAgent2026!', INITIAL_DEMO_USERS[1].passwordSalt);
    seededUsers.push({
      ...INITIAL_DEMO_USERS[1],
      passwordHash: agentHash.hash
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
  }

  // Ensure initial inquiries exist
  const existingInquiries = localStorage.getItem(INQUIRIES_KEY);
  if (!existingInquiries) {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_DEMO_INQUIRIES));
  }
}

/**
 * Retrieves all stored users
 */
export function getStoredUsers(): StoredUserRecord[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error fetching users from storage:', e);
    return [];
  }
}

/**
 * Saves users to storage
 */
export function saveStoredUsers(users: StoredUserRecord[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Finds user by email (case-insensitive)
 */
export function findUserByEmail(email: string): StoredUserRecord | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
}

/**
 * Finds user by ID
 */
export function findUserById(id: string): StoredUserRecord | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.id === id);
}

/**
 * Strips password hash and salt for safe client usage
 */
export function sanitizeUser(user: StoredUserRecord): User {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a new user
 */
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'agent';
  phone?: string;
  agencyName?: string;
  licenseNumber?: string;
}): Promise<{ user: User; token: string }> {
  await initializeAuthDatabase();

  const existing = findUserByEmail(userData.email);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const { hash, salt } = await hashPassword(userData.password);
  const newUser: StoredUserRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone?.trim(),
    role: userData.role,
    agencyName: userData.role === 'agent' ? userData.agencyName?.trim() : undefined,
    licenseNumber: userData.role === 'agent' ? userData.licenseNumber?.trim() : undefined,
    avatar: userData.role === 'agent'
      ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    passwordHash: hash,
    passwordSalt: salt
  };

  const users = getStoredUsers();
  users.push(newUser);
  saveStoredUsers(users);

  const safeUser = sanitizeUser(newUser);
  const token = generateJWT({ sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name }, 24);

  // Store active session token
  localStorage.setItem(TOKEN_KEY, token);

  return { user: safeUser, token };
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ user: User; token: string }> {
  await initializeAuthDatabase();

  const user = findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email address or password.');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!isPasswordValid) {
    throw new Error('Invalid email address or password.');
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveStoredUsers(users);
  }

  const safeUser = sanitizeUser(user);
  const durationHours = rememberMe ? 72 : 12;
  const token = generateJWT({ sub: safeUser.id, email: safeUser.email, role: safeUser.role, name: safeUser.name }, durationHours);

  localStorage.setItem(TOKEN_KEY, token);

  return { user: safeUser, token };
}

/**
 * Gets currently authenticated user from stored token
 */
export function getCurrentSessionUser(): { user: User | null; token: string | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { user: null, token: null };

  const verification = verifyJWT(token);
  if (!verification.valid || !verification.payload) {
    localStorage.removeItem(TOKEN_KEY);
    return { user: null, token: null };
  }

  const userRecord = findUserById(verification.payload.sub);
  if (!userRecord) {
    localStorage.removeItem(TOKEN_KEY);
    return { user: null, token: null };
  }

  return { user: sanitizeUser(userRecord), token };
}

/**
 * Logout
 */
export function logoutSession(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Request Password Reset Token
 */
export async function createPasswordResetRequest(email: string): Promise<{ token: string; email: string }> {
  await initializeAuthDatabase();
  const user = findUserByEmail(email);
  if (!user) {
    throw new Error('No registered account found with that email address.');
  }

  const token = generateSecureResetToken();
  const resetRecord: PasswordResetToken = {
    token,
    email: user.email,
    userId: user.id,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
    used: false,
    createdAt: new Date().toISOString()
  };

  const storedResets: PasswordResetToken[] = JSON.parse(localStorage.getItem(RESETS_KEY) || '[]');
  // Invalidate any prior unused tokens for this email
  const updatedResets = storedResets.map((r) => (r.email === user.email ? { ...r, used: true } : r));
  updatedResets.push(resetRecord);
  localStorage.setItem(RESETS_KEY, JSON.stringify(updatedResets));

  return { token, email: user.email };
}

/**
 * Validates Password Reset Token
 */
export function validatePasswordResetToken(token: string): { valid: boolean; error?: string; resetData?: PasswordResetToken } {
  const storedResets: PasswordResetToken[] = JSON.parse(localStorage.getItem(RESETS_KEY) || '[]');
  const resetRecord = storedResets.find((r) => r.token === token);

  if (!resetRecord) {
    return { valid: false, error: 'Password reset link is invalid or does not exist.' };
  }

  if (resetRecord.used) {
    return { valid: false, error: 'This password reset link has already been used. Please request a new one.' };
  }

  if (Date.now() > resetRecord.expiresAt) {
    return { valid: false, error: 'This password reset link has expired (15-minute validity). Please request a new link.' };
  }

  return { valid: true, resetData: resetRecord };
}

/**
 * Executes Password Reset
 */
export async function executePasswordReset(token: string, newPassword: string): Promise<void> {
  const validation = validatePasswordResetToken(token);
  if (!validation.valid || !validation.resetData) {
    throw new Error(validation.error || 'Invalid reset token.');
  }

  const users = getStoredUsers();
  const userIndex = users.findIndex((u) => u.id === validation.resetData!.userId);
  if (userIndex === -1) {
    throw new Error('Associated user account was not found.');
  }

  // Hash new password
  const { hash, salt } = await hashPassword(newPassword);
  users[userIndex].passwordHash = hash;
  users[userIndex].passwordSalt = salt;
  saveStoredUsers(users);

  // Mark token as used
  const storedResets: PasswordResetToken[] = JSON.parse(localStorage.getItem(RESETS_KEY) || '[]');
  const updatedResets = storedResets.map((r) => (r.token === token ? { ...r, used: true } : r));
  localStorage.setItem(RESETS_KEY, JSON.stringify(updatedResets));
}

/**
 * Inquiries / Leads Database Management
 */
export function getInquiries(agentId?: string): Inquiry[] {
  try {
    const data = localStorage.getItem(INQUIRIES_KEY);
    const list: Inquiry[] = data ? JSON.parse(data) : [];
    if (!agentId) return list;
    return list.filter((i) => i.agentId === agentId || (!i.agentId && agentId === 'user-agent-001'));
  } catch (e) {
    return [];
  }
}

export function saveInquiries(inquiries: Inquiry[]): void {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
}

export function addInquiry(
  inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'> & { status?: InquiryStatus; notes?: Inquiry['notes'] }
): Inquiry {
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    status: inquiryData.status || 'new',
    notes: inquiryData.notes || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  return newInquiry;
}

export function updateInquiryStatus(inquiryId: string, status: InquiryStatus, agentId?: string): boolean {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === inquiryId);
  if (index === -1) return false;
  
  // Verify agent ownership if provided
  if (agentId && inquiries[index].agentId && inquiries[index].agentId !== agentId && !(agentId === 'user-agent-001' && inquiries[index].agentId === 'user-agent-001')) {
    return false;
  }

  inquiries[index].status = status;
  inquiries[index].updatedAt = new Date().toISOString();
  saveInquiries(inquiries);
  return true;
}

export function addInquiryNote(
  inquiryId: string,
  text: string,
  authorName: string,
  agentId?: string
): { id: string; text: string; createdAt: string; authorName: string } | null {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === inquiryId);
  if (index === -1) return null;

  // Verify agent ownership if provided
  if (agentId && inquiries[index].agentId && inquiries[index].agentId !== agentId && !(agentId === 'user-agent-001' && inquiries[index].agentId === 'user-agent-001')) {
    return null;
  }

  const newNote = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    authorName: authorName.trim()
  };

  if (!inquiries[index].notes) {
    inquiries[index].notes = [];
  }
  inquiries[index].notes!.push(newNote);
  inquiries[index].updatedAt = new Date().toISOString();
  saveInquiries(inquiries);
  return newNote;
}

export function deleteInquiry(inquiryId: string, agentId?: string): boolean {
  const inquiries = getInquiries();
  const inquiry = inquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return false;

  // Verify agent ownership if provided
  if (agentId && inquiry.agentId && inquiry.agentId !== agentId && !(agentId === 'user-agent-001' && inquiry.agentId === 'user-agent-001')) {
    return false;
  }

  const filtered = inquiries.filter((i) => i.id !== inquiryId);
  saveInquiries(filtered);
  return true;
}

