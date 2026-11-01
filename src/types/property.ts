export interface RoomLayout {
  name: string;
  size: string;
  color: string;
}

export interface FloorPlan {
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  deposit: number;
  description: string;
  rooms: RoomLayout[];
}

export type PropertyListingStatus = 'active' | 'draft' | 'sold' | 'rented' | 'inactive';

export type LandmarkCategory = 
  | 'school' 
  | 'hospital' 
  | 'shopping' 
  | 'restaurant' 
  | 'park' 
  | 'transit' 
  | 'culture';

export interface Landmark {
  id: string;
  name: string;
  category: LandmarkCategory;
  distance?: string; // e.g. "0.4 km"
  distanceKm?: number;
  walkTime?: string; // e.g. "5 min walk"
  driveTime?: string; // e.g. "2 min drive"
  transitTime?: string; // e.g. "4 min transit"
  address?: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  location: string; // Combined display string: e.g. "North York, Toronto"
  address?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  type: 'Apartment' | 'Condo' | 'Penthouse' | 'Townhouse' | 'Villa';
  bedrooms: number; // 0 for Studio, 1, 2, etc.
  bathrooms: number;
  sqft: number;
  featured: boolean;
  image: string;
  amenities: string[];
  gallery?: string[];
  description?: string;
  deposit?: number;
  applicationFee?: number;
  utilities?: string[];
  floorPlans?: FloorPlan[];
  landmarks?: Landmark[];
  status?: PropertyListingStatus;
  agentId?: string;       // Owner agent ID
  agentName?: string;     // Agent Name
  agentEmail?: string;    // Agent Email
  agentPhone?: string;    // Agent Phone
  agentAgency?: string;   // Agent Agency
  createdAt?: string;
  updatedAt?: string;
}


