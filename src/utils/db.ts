import { properties as defaultProperties } from '../data/properties';
import type { Property, PropertyListingStatus } from '../types/property';
import type { User } from '../types/auth';

const PROPERTIES_KEY = 'elite_estate_properties';
export const DEFAULT_AGENT_ID = 'user-agent-001';

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  toronto: { lat: 43.6532, lng: -79.3832 },
  'north york': { lat: 43.7615, lng: -79.4111 },
  'liberty village': { lat: 43.6375, lng: -79.4190 },
  scarborough: { lat: 43.7764, lng: -79.2318 },
  etobicoke: { lat: 43.6205, lng: -79.4790 },
  vancouver: { lat: 49.2827, lng: -123.1207 },
  'coal harbour': { lat: 49.2890, lng: -123.1235 },
  yaletown: { lat: 49.2748, lng: -123.1216 },
  kitsilano: { lat: 49.2684, lng: -123.1682 },
  montreal: { lat: 45.5017, lng: -73.5673 },
  griffintown: { lat: 45.4925, lng: -73.5601 },
  calgary: { lat: 51.0447, lng: -114.0719 },
  beltline: { lat: 51.0410, lng: -114.0730 },
  ottawa: { lat: 45.4215, lng: -75.6972 },
  westboro: { lat: 45.3912, lng: -75.7533 }
};

export function resolveCoordinates(city: string = '', neighborhood: string = ''): { lat: number; lng: number } {
  const nKey = neighborhood.toLowerCase().trim();
  const cKey = city.toLowerCase().trim();

  if (CITY_COORDINATES[nKey]) {
    return CITY_COORDINATES[nKey];
  }
  if (CITY_COORDINATES[cKey]) {
    return CITY_COORDINATES[cKey];
  }
  return { lat: 43.6532, lng: -79.3832 }; // Fallback Toronto
}

/**
 * Normalizes property records to ensure status, coordinates, and agent defaults
 */
function normalizeProperty(p: Property): Property {
  // Check if matching default property has explicit coords
  const matchedDefault = defaultProperties.find((dp) => dp.id === p.id);
  const fallbackCoords = resolveCoordinates(p.city, p.neighborhood);

  const lat = p.latitude ?? matchedDefault?.latitude ?? fallbackCoords.lat;
  const lng = p.longitude ?? matchedDefault?.longitude ?? fallbackCoords.lng;
  const address = p.address || matchedDefault?.address || `${p.location || `${p.neighborhood}, ${p.city}`}`;

  return {
    ...p,
    address,
    latitude: lat,
    longitude: lng,
    status: p.status || 'active',
    agentId: p.agentId || DEFAULT_AGENT_ID,
    agentName: p.agentName || 'Victoria Vance',
    agentEmail: p.agentEmail || 'agent@eliteestate.com',
    agentPhone: p.agentPhone || '+1 (416) 555-0199',
    agentAgency: p.agentAgency || 'Elite Sovereign Properties Ltd.',
    createdAt: p.createdAt || '2026-01-10T10:00:00.000Z',
    updatedAt: p.updatedAt || new Date().toISOString()
  };
}

export const getProperties = (): Property[] => {
  const stored = localStorage.getItem(PROPERTIES_KEY);
  if (!stored) {
    const normalized = defaultProperties.map(normalizeProperty);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(normalized));
    return normalized;
  }
  try {
    const parsed: Property[] = JSON.parse(stored);
    return parsed.map(normalizeProperty);
  } catch (e) {
    console.error('Error parsing stored properties, resetting database.', e);
    const normalized = defaultProperties.map(normalizeProperty);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(normalized));
    return normalized;
  }
};

export const saveProperties = (data: Property[]) => {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(data));
};

/**
 * Retrieves public-facing properties (excluding draft and inactive)
 */
export const getPublicProperties = (): Property[] => {
  const all = getProperties();
  return all.filter((p) => p.status !== 'draft' && p.status !== 'inactive');
};

/**
 * Retrieves properties owned by a specific agent
 */
export const getAgentProperties = (agentId: string): Property[] => {
  const all = getProperties();
  return all.filter((p) => p.agentId === agentId || (!p.agentId && agentId === DEFAULT_AGENT_ID));
};

/**
 * Adds a new property listing assigned to an agent
 */
export const addProperty = (
  propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>,
  agent?: Partial<User> | null
): Property => {
  const all = getProperties();
  const coords = propertyData.latitude && propertyData.longitude 
    ? { lat: propertyData.latitude, lng: propertyData.longitude }
    : resolveCoordinates(propertyData.city, propertyData.neighborhood);

  const newProperty: Property = {
    ...propertyData,
    id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    latitude: coords.lat,
    longitude: coords.lng,
    address: propertyData.address || `${propertyData.neighborhood || ''}, ${propertyData.city || ''}`.replace(/^,\s*/, ''),
    status: propertyData.status || 'active',
    agentId: agent?.id || propertyData.agentId || DEFAULT_AGENT_ID,
    agentName: agent?.name || propertyData.agentName || 'Victoria Vance',
    agentEmail: agent?.email || propertyData.agentEmail || 'agent@eliteestate.com',
    agentPhone: agent?.phone || propertyData.agentPhone || '+1 (416) 555-0199',
    agentAgency: agent?.agencyName || propertyData.agentAgency || 'Elite Sovereign Properties Ltd.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newProperty, ...all];
  saveProperties(updated);
  return newProperty;
};

/**
 * Updates a property listing with ownership verification
 */
export const updateProperty = (
  propertyId: string,
  updates: Partial<Property>,
  agentId?: string
): { success: boolean; property?: Property; error?: string } => {
  const all = getProperties();
  const index = all.findIndex((p) => p.id === propertyId);
  if (index === -1) {
    return { success: false, error: 'Property not found' };
  }

  const existing = all[index];
  // Verify ownership
  if (agentId && existing.agentId && existing.agentId !== agentId && !(agentId === DEFAULT_AGENT_ID && existing.agentId === DEFAULT_AGENT_ID)) {
    return { success: false, error: 'Unauthorized: You can only modify your own listings.' };
  }

  const updatedProperty: Property = {
    ...existing,
    ...updates,
    id: existing.id, // Prevent ID modification
    agentId: existing.agentId, // Preserve ownership
    updatedAt: new Date().toISOString()
  };

  all[index] = updatedProperty;
  saveProperties(all);
  return { success: true, property: updatedProperty };
};

/**
 * Deletes a property listing with ownership verification
 */
export const deleteProperty = (
  propertyId: string,
  agentId?: string
): { success: boolean; error?: string } => {
  const all = getProperties();
  const property = all.find((p) => p.id === propertyId);
  if (!property) {
    return { success: false, error: 'Property not found' };
  }

  // Verify ownership
  if (agentId && property.agentId && property.agentId !== agentId && !(agentId === DEFAULT_AGENT_ID && property.agentId === DEFAULT_AGENT_ID)) {
    return { success: false, error: 'Unauthorized: You can only delete your own listings.' };
  }

  const filtered = all.filter((p) => p.id !== propertyId);
  saveProperties(filtered);
  return { success: true };
};

/**
 * Quickly updates the status of a property
 */
export const updatePropertyStatus = (
  propertyId: string,
  status: PropertyListingStatus,
  agentId?: string
): { success: boolean; error?: string } => {
  return updateProperty(propertyId, { status }, agentId);
};

