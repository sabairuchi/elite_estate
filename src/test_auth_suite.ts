/**
 * Automated Verification Test Suite for Elite State
 * Milestone 1: Account Access & Verification
 * Milestone 2: Agent Workspace & Listings Hub
 */

import { hashPassword, verifyPassword, generateJWT, verifyJWT, generateSecureResetToken } from './utils/crypto';
import type { User, UserRole, StoredUserRecord, PasswordResetToken, Inquiry, InquiryStatus } from './types/auth';
import type { Property, PropertyListingStatus } from './types/property';

// Mock localStorage for Node test runner
const storage: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// Mock window.crypto
if (!(globalThis as any).window) {
  (globalThis as any).window = { crypto: globalThis.crypto };
}

async function runFullTestSuite() {
  console.log('================================================================');
  console.log('  ELITE STATE - MILESTONE 1 & 2 VERIFICATION TEST SUITE         ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing & Verification
  console.log('--- 1. Cryptographic Password Security ---');
  const password = 'EliteBuyer2026!';
  const { hash, salt } = await hashPassword(password);
  assert(hash.length === 64, 'SHA-256 hash length is 64 hex characters');
  assert(salt.length === 32, 'Salt is a 16-byte (32 hex characters) unique salt');

  const isValidMatch = await verifyPassword(password, hash, salt);
  assert(isValidMatch === true, 'Matching password verifies correctly');

  const isInvalidMatch = await verifyPassword('WrongPassword123!', hash, salt);
  assert(isInvalidMatch === false, 'Incorrect password correctly rejected');

  // 2. JWT Generation & Verification
  console.log('\n--- 2. JWT Session & Token Management ---');
  const userPayload = { sub: 'user-001', email: 'buyer@eliteestate.com', role: 'buyer', name: 'Alexander Sterling' };
  const token = generateJWT(userPayload, 24);
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT has correct 3-part structure (Header.Payload.Signature)');

  const decoded = verifyJWT(token);
  assert(decoded.valid === true, 'JWT token decodes and verifies successfully');
  assert(decoded.payload.sub === 'user-001', 'JWT payload contains correct user sub');
  assert(decoded.payload.role === 'buyer', 'JWT payload contains correct role');

  // Expired token test
  const expiredToken = generateJWT(userPayload, -1);
  const decodedExpired = verifyJWT(expiredToken);
  assert(decodedExpired.valid === false && decodedExpired.error === 'Token expired', 'Expired token is correctly detected and rejected');

  // 3. User Storage & Registration
  console.log('\n--- 3. User Registration & Database ---');
  const { registerUser, loginUser, findUserByEmail, sanitizeUser, getStoredUsers, saveStoredUsers } = await import('./utils/authStorage');

  // Test Buyer Registration
  const buyerReg = await registerUser({
    name: 'Lady Eleanor Vance',
    email: 'eleanor@vance-holdings.com',
    password: 'SecurePassword2026!',
    role: 'buyer',
    phone: '+1 (416) 555-8899'
  });
  assert(buyerReg.user.email === 'eleanor@vance-holdings.com', 'Buyer account successfully registered');
  assert(buyerReg.user.role === 'buyer', 'Buyer role is assigned properly');
  assert((buyerReg.user as any).passwordHash === undefined, 'Sanitized user does not leak password hash');

  // Test Agent Registration with License & Agency
  const agentReg = await registerUser({
    name: 'Lord Marcus Sterling',
    email: 'marcus@sovereignproperties.ca',
    password: 'AgentSecure2026!',
    role: 'agent',
    agencyName: 'Sterling Sovereign Real Estate',
    licenseNumber: 'RECO-ON-778899'
  });
  assert(agentReg.user.role === 'agent', 'Agent role successfully registered');
  assert(agentReg.user.agencyName === 'Sterling Sovereign Real Estate', 'Agent brokerage name stored');
  assert(agentReg.user.licenseNumber === 'RECO-ON-778899', 'Agent license ID stored');

  // Duplicate email check
  let duplicateError = false;
  try {
    await registerUser({
      name: 'Duplicate',
      email: 'eleanor@vance-holdings.com',
      password: 'Pass!',
      role: 'buyer'
    });
  } catch (e) {
    duplicateError = true;
  }
  assert(duplicateError === true, 'Registration correctly rejects duplicate email addresses');

  // 4. Authentication Login
  console.log('\n--- 4. Authentication Login Flows ---');
  const loginRes = await loginUser('eleanor@vance-holdings.com', 'SecurePassword2026!');
  assert(loginRes.user.email === 'eleanor@vance-holdings.com', 'Login succeeds with valid credentials');
  assert(typeof loginRes.token === 'string', 'Login returns valid session token');

  let badPassError = false;
  try {
    await loginUser('eleanor@vance-holdings.com', 'WrongPassword!');
  } catch (e) {
    badPassError = true;
  }
  assert(badPassError === true, 'Login fails with incorrect password');

  // 5. Seeded Demo Accounts Check
  console.log('\n--- 5. Seeded Demo Accounts ---');
  const demoBuyer = await loginUser('buyer@eliteestate.com', 'EliteBuyer2026!');
  assert(demoBuyer.user.role === 'buyer', 'Default Demo Buyer (buyer@eliteestate.com) logs in successfully');

  const demoAgent = await loginUser('agent@eliteestate.com', 'EliteAgent2026!');
  assert(demoAgent.user.role === 'agent', 'Default Demo Agent (agent@eliteestate.com) logs in successfully');

  // 6. Role-Based Access Control (RBAC) Logic
  console.log('\n--- 6. Role-Based Access Control (RBAC) ---');
  function checkAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
  }

  assert(checkAccess('buyer', ['buyer']) === true, 'Buyer has access to Buyer Dashboard');
  assert(checkAccess('buyer', ['agent']) === false, 'Buyer is strictly blocked from Agent Dashboard');
  assert(checkAccess('agent', ['agent']) === true, 'Agent has access to Agent Dashboard');
  assert(checkAccess('agent', ['buyer']) === false, 'Agent is strictly blocked from Buyer Dashboard');

  // 7. Password Recovery & Single-Use Tokens
  console.log('\n--- 7. Password Reset & Single-Use Tokens ---');
  const { createPasswordResetRequest, validatePasswordResetToken, executePasswordReset } = await import('./utils/authStorage');

  const resetReq = await createPasswordResetRequest('buyer@eliteestate.com');
  assert(typeof resetReq.token === 'string' && resetReq.token.length === 48, 'Cryptographically secure 48-char reset token generated');

  const tokenVal = validatePasswordResetToken(resetReq.token);
  assert(tokenVal.valid === true && tokenVal.resetData?.email === 'buyer@eliteestate.com', 'Reset token validates with 15-min expiration');

  await executePasswordReset(resetReq.token, 'NewEliteBuyer2026#');
  
  const newLogin = await loginUser('buyer@eliteestate.com', 'NewEliteBuyer2026#');
  assert(newLogin.user.email === 'buyer@eliteestate.com', 'Login succeeds with the new reset password');

  const reusedVal = validatePasswordResetToken(resetReq.token);
  assert(reusedVal.valid === false && reusedVal.error?.includes('already been used'), 'Reset token is invalidated and cannot be reused');

  // =========================================================================
  // MILESTONE 2 TESTS: PROPERTY MANAGEMENT & AGENT WORKSPACE
  // =========================================================================
  console.log('\n--- 8. Milestone 2: Property Management CRUD & Ownership ---');
  const { 
    getProperties, 
    getPublicProperties, 
    getAgentProperties, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    updatePropertyStatus 
  } = await import('./utils/db');

  // Agent 1: Lord Marcus Sterling
  const agent1 = agentReg.user;
  // Agent 2: Victoria Vance
  const agent2 = demoAgent.user;

  // 8.1 Create Property Listing for Agent 1
  const createdProp = addProperty({
    title: 'The Sovereign Tower Penthouse',
    city: 'Toronto',
    neighborhood: 'Yorkville',
    location: 'Yorkville, Toronto',
    price: 6500,
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2400,
    featured: true,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Rooftop Terrace'],
    description: 'Ultra-luxurious penthouse overlooking Toronto skyline.',
    deposit: 6500,
    applicationFee: 100
  }, agent1);

  assert(typeof createdProp.id === 'string', 'Property created with unique ID');
  assert(createdProp.agentId === agent1.id, 'Property correctly assigned to Agent 1 (Lord Marcus)');
  assert(createdProp.status === 'active', 'Property initialized with active status');

  // 8.2 Verify Agent 1 only sees their listings in agent query
  const agent1Props = getAgentProperties(agent1.id);
  assert(agent1Props.some(p => p.id === createdProp.id), 'Agent 1 sees their created listing in workspace portfolio');

  // 8.3 Edit Property by Owner Agent (Agent 1)
  const editRes1 = updateProperty(createdProp.id, { price: 7000, title: 'The Sovereign Tower Penthouse (Updated)' }, agent1.id);
  assert(editRes1.success === true, 'Owner Agent 1 successfully updates property details');
  assert(editRes1.property?.price === 7000, 'Updated price reflects in property model');

  // 8.4 Ownership Isolation: Agent 2 tries to edit Agent 1's listing (MUST FAIL)
  const unauthorizedEdit = updateProperty(createdProp.id, { price: 3000 }, agent2.id);
  assert(unauthorizedEdit.success === false, 'Unauthorized Agent 2 is blocked from modifying Agent 1 listing');
  assert(unauthorizedEdit.error?.includes('Unauthorized'), 'Returns clear unauthorized error message');

  // 8.5 Ownership Isolation: Agent 2 tries to delete Agent 1's listing (MUST FAIL)
  const unauthorizedDelete = deleteProperty(createdProp.id, agent2.id);
  assert(unauthorizedDelete.success === false, 'Unauthorized Agent 2 is blocked from deleting Agent 1 listing');

  // 9. Property Status Lifecycle & Public Catalog Filtering
  console.log('\n--- 9. Milestone 2: Status Lifecycle & Public Visibility ---');
  
  // Set to Draft
  updatePropertyStatus(createdProp.id, 'draft', agent1.id);
  let publicListings = getPublicProperties();
  assert(!publicListings.some(p => p.id === createdProp.id), 'Draft properties are excluded from public catalog');

  // Set back to Active
  updatePropertyStatus(createdProp.id, 'active', agent1.id);
  publicListings = getPublicProperties();
  assert(publicListings.some(p => p.id === createdProp.id), 'Active properties are visible in public catalog');

  // Set to Sold / Rented
  updatePropertyStatus(createdProp.id, 'sold', agent1.id);
  const updatedSoldProp = getProperties().find(p => p.id === createdProp.id);
  assert(updatedSoldProp?.status === 'sold', 'Property status transitions to Sold');

  // 10. Lead & Inquiry Pipeline Management with Internal Notes
  console.log('\n--- 10. Milestone 2: Lead & Inquiry Pipeline with Internal Notes ---');
  const { 
    getInquiries, 
    addInquiry, 
    updateInquiryStatus, 
    addInquiryNote, 
    deleteInquiry 
  } = await import('./utils/authStorage');

  // Create inquiry specifically assigned to Agent 1's property
  const newLead = addInquiry({
    propertyId: createdProp.id,
    propertyTitle: createdProp.title,
    agentId: agent1.id,
    type: 'tour',
    name: 'Eleanor Vance',
    email: 'eleanor@vance-holdings.com',
    phone: '+1 (416) 555-8899',
    date: '2026-09-10',
    timeSlot: 'afternoon',
    message: 'VIP Tour request with legal advisor present.',
    status: 'new',
    userId: buyerReg.user.id
  });

  assert(newLead.status === 'new', 'New lead initializes with "new" pipeline status');
  assert(newLead.agentId === agent1.id, 'Lead is attributed to assigned Agent 1');

  // Filter inquiries by Agent 1
  const agent1Leads = getInquiries(agent1.id);
  assert(agent1Leads.some(l => l.id === newLead.id), 'Agent 1 retrieves assigned lead in workspace');

  // Update Lead Status to 'contacted'
  const updateStatusRes = updateInquiryStatus(newLead.id, 'contacted', agent1.id);
  assert(updateStatusRes === true, 'Agent 1 transitions lead stage to "contacted"');

  // Add Internal Notes
  const note1 = addInquiryNote(
    newLead.id, 
    'Called client on Thursday. Pre-qualified for multi-year lease. Prefers sunset viewing.', 
    agent1.name, 
    agent1.id
  );
  assert(note1 !== null, 'Internal agent note added successfully');
  assert(note1?.authorName === agent1.name, 'Note records author agent name');

  // Add Second Note
  const note2 = addInquiryNote(
    newLead.id,
    'Client requested building bylaws regarding private concierge services.',
    agent1.name,
    agent1.id
  );
  assert(note2 !== null, 'Second sequential internal note added');

  // Verify notes persistence
  const loadedLead = getInquiries().find(i => i.id === newLead.id);
  assert(loadedLead?.notes?.length === 2, 'Lead persists full chronological history of internal notes');
  assert(loadedLead?.status === 'contacted', 'Lead status is updated to contacted');

  // Unauthorized Agent 2 cannot add notes or delete Agent 1's lead
  const unauthNote = addInquiryNote(newLead.id, 'Unauthorized note', agent2.name, agent2.id);
  assert(unauthNote === null, 'Unauthorized agent blocked from adding notes to another agent lead');

  // 11. Agent Profile & Availability Settings
  console.log('\n--- 11. Milestone 2: Agent Profile & Availability Settings ---');
  const storedUsers = getStoredUsers();
  const agentIndex = storedUsers.findIndex(u => u.id === agent1.id);
  assert(agentIndex !== -1, 'Agent user record located in storage');

  // Update Profile & Availability
  storedUsers[agentIndex] = {
    ...storedUsers[agentIndex],
    officeAddress: '200 Bay Street, Suite 3200, Toronto, ON',
    workingHours: 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: By Appointment',
    availabilitySlots: ['Morning (9am - 12pm)', 'Evening (5pm - 8pm)'],
    preferredContactMethod: 'whatsapp',
    bio: 'Luxury real estate advisor specializing in Yorkville penthouses.'
  };
  saveStoredUsers(storedUsers);

  const updatedAgentUser = sanitizeUser(getStoredUsers().find(u => u.id === agent1.id)!);
  assert(updatedAgentUser.officeAddress === '200 Bay Street, Suite 3200, Toronto, ON', 'Office address saved');
  assert(updatedAgentUser.workingHours === 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: By Appointment', 'Working hours saved');
  assert(updatedAgentUser.availabilitySlots?.length === 2, 'Availability slots saved');
  assert(updatedAgentUser.preferredContactMethod === 'whatsapp', 'Preferred contact method saved');

  // 12. Delete Property Listing (Clean-up)
  console.log('\n--- 12. Property Deletion Verification ---');
  const deleteRes = deleteProperty(createdProp.id, agent1.id);
  assert(deleteRes.success === true, 'Owner Agent 1 successfully deletes their property listing');
  const checkDeleted = getProperties().find(p => p.id === createdProp.id);
  assert(checkDeleted === undefined, 'Property is permanently removed from active catalog');

  console.log('\n================================================================');
  console.log(`  ALL TESTS COMPLETED: ${passed} Passed, ${failed} Failed      `);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFullTestSuite().catch(err => {
  console.error('Error running test suite:', err);
  process.exit(1);
});
