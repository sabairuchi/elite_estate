import type { Landmark, LandmarkCategory, Property } from '../types/property';

export const ALL_LANDMARKS: Landmark[] = [
  // ================= TORONTO LANDMARKS =================
  // North York
  {
    id: 'lm-to-1',
    name: 'North York Centre Station',
    category: 'transit',
    address: '5100 Yonge St, North York, ON',
    description: 'Direct Line 1 TTC subway access connecting to downtown Union Station.',
    latitude: 43.7686,
    longitude: -79.4128
  },
  {
    id: 'lm-to-2',
    name: 'North York General Hospital',
    category: 'hospital',
    address: '4001 Leslie St, North York, ON',
    description: 'Leading multi-specialty acute care and emergency teaching hospital.',
    latitude: 43.7694,
    longitude: -79.3638
  },
  {
    id: 'lm-to-3',
    name: 'Earl Bales Park & Amphitheatre',
    category: 'park',
    address: '4169 Bathurst St, North York, ON',
    description: '127 acres of scenic valley trails, ski hill, dog park, and splash pads.',
    latitude: 43.7548,
    longitude: -79.4352
  },
  {
    id: 'lm-to-4',
    name: 'Yorkdale Shopping Centre',
    category: 'shopping',
    address: '3401 Dufferin St, Toronto, ON',
    description: 'Canada’s premier luxury retail center with Holt Renfrew, Gucci, and Tiffany & Co.',
    latitude: 43.7254,
    longitude: -79.4522
  },
  {
    id: 'lm-to-5',
    name: 'Havergal College',
    category: 'school',
    address: '1451 Avenue Rd, North York, ON',
    description: 'Prestigious independent day and boarding academy established in 1894.',
    latitude: 43.7276,
    longitude: -79.4146
  },
  {
    id: 'lm-to-6',
    name: 'Auberge du Pommier',
    category: 'restaurant',
    address: '4150 Yonge St, North York, ON',
    description: 'Exquisite French fine dining housed in heritage 1860s timber cottages.',
    latitude: 43.7476,
    longitude: -79.4069
  },

  // Liberty Village & Downtown Toronto
  {
    id: 'lm-to-7',
    name: 'Liberty Market Building',
    category: 'shopping',
    address: '171 E Liberty St, Toronto, ON',
    description: 'Historic loft complex featuring boutique artisan bakeries, design studios, and cafes.',
    latitude: 43.6382,
    longitude: -79.4184
  },
  {
    id: 'lm-to-8',
    name: 'Exhibition GO & Streetcar Hub',
    category: 'transit',
    address: 'Manitoba Dr, Toronto, ON',
    description: 'Express rail line direct to Union Station in under 8 minutes.',
    latitude: 43.6358,
    longitude: -79.4158
  },
  {
    id: 'lm-to-9',
    name: 'University of Toronto (St. George)',
    category: 'school',
    address: '27 King’s College Cir, Toronto, ON',
    description: 'Top-ranked global research institution with iconic Gothic revival architecture.',
    latitude: 43.6629,
    longitude: -79.3957
  },
  {
    id: 'lm-to-10',
    name: 'Mount Sinai Hospital',
    category: 'hospital',
    address: '600 University Ave, Toronto, ON',
    description: 'World-renowned medical research hospital located on Hospital Row.',
    latitude: 43.6575,
    longitude: -79.3902
  },
  {
    id: 'lm-to-11',
    name: 'Trinity Bellwoods Park',
    category: 'park',
    address: '790 Queen St W, Toronto, ON',
    description: 'Vibrant green oasis with tennis courts, farmers market, and skyline views.',
    latitude: 43.6473,
    longitude: -79.4137
  },
  {
    id: 'lm-to-12',
    name: 'Alo Restaurant',
    category: 'restaurant',
    address: '163 Spadina Ave, Toronto, ON',
    description: 'Michelin-starred contemporary French culinary experience atop a heritage building.',
    latitude: 43.6499,
    longitude: -79.3965
  },
  {
    id: 'lm-to-13',
    name: 'Royal Ontario Museum (ROM)',
    category: 'culture',
    address: '100 Queen’s Park, Toronto, ON',
    description: 'Canada’s largest museum of art, world cultures, and natural history.',
    latitude: 43.6677,
    longitude: -79.3948
  },

  // Scarborough & Etobicoke
  {
    id: 'lm-to-14',
    name: 'Scarborough Bluffs Park',
    category: 'park',
    address: '1 Brimley Rd S, Scarborough, ON',
    description: 'Dramatic 90-meter white limestone cliffs overlooking Lake Ontario beaches.',
    latitude: 43.7058,
    longitude: -79.2312
  },
  {
    id: 'lm-to-15',
    name: 'Humber Bay Shores Waterfront Park',
    category: 'park',
    address: '15 Marine Parade Dr, Etobicoke, ON',
    description: 'Lakeside promenade with bicycle trails and butterfly habitat.',
    latitude: 43.6212,
    longitude: -79.4795
  },

  // ================= VANCOUVER LANDMARKS =================
  // Coal Harbour & Yaletown & Kitsilano
  {
    id: 'lm-va-1',
    name: 'Stanley Park Seawall',
    category: 'park',
    address: 'Stanley Park, Vancouver, BC',
    description: 'World-famous 1,000-acre coastal rainforest park with continuous oceanside seawall.',
    latitude: 49.2985,
    longitude: -123.1362
  },
  {
    id: 'lm-va-2',
    name: 'Waterfront Station Hub',
    category: 'transit',
    address: '601 W Cordova St, Vancouver, BC',
    description: 'Central terminus for Expo Line, Millennium Line, Canada Line, and SeaBus.',
    latitude: 49.2858,
    longitude: -123.1118
  },
  {
    id: 'lm-va-3',
    name: 'St. Paul’s Hospital',
    category: 'hospital',
    address: '1081 Burrard St, Vancouver, BC',
    description: 'Major downtown acute care and provincial cardiac care center.',
    latitude: 49.2809,
    longitude: -123.1287
  },
  {
    id: 'lm-va-4',
    name: 'Pacific Centre & Robson Street',
    category: 'shopping',
    address: '701 W Georgia St, Vancouver, BC',
    description: 'High-end flagship shopping promenade featuring Nordstrom and designer boutiques.',
    latitude: 49.2831,
    longitude: -123.1189
  },
  {
    id: 'lm-va-5',
    name: 'Blue Water Cafe',
    category: 'restaurant',
    address: '1095 Hamilton St, Vancouver, BC',
    description: 'Premier Pacific Northwest seafood and sushi destination in historic Yaletown.',
    latitude: 49.2755,
    longitude: -123.1209
  },
  {
    id: 'lm-va-6',
    name: 'Yaletown-Roundhouse SkyTrain',
    category: 'transit',
    address: '1100 Mainland St, Vancouver, BC',
    description: 'Canada Line station offering 20-minute rapid transit to Vancouver Airport (YVR).',
    latitude: 49.2745,
    longitude: -123.1218
  },
  {
    id: 'lm-va-7',
    name: 'Kitsilano Beach & Outdoor Pool',
    category: 'park',
    address: '1499 Arbutus St, Vancouver, BC',
    description: 'Iconic beach overlooking English Bay and Canada’s longest heated saltwater pool.',
    latitude: 49.2737,
    longitude: -123.1539
  },
  {
    id: 'lm-va-8',
    name: 'Kitsilano Secondary School',
    category: 'school',
    address: '2706 Trafalgar St, Vancouver, BC',
    description: 'Top-rated public secondary institution known for French Immersion & STEM.',
    latitude: 49.2618,
    longitude: -123.1620
  },
  {
    id: 'lm-va-9',
    name: 'Vancouver Art Gallery',
    category: 'culture',
    address: '750 Hornby St, Vancouver, BC',
    description: 'Historic neo-classical courthouse gallery housing landmark Canadian collections.',
    latitude: 49.2828,
    longitude: -123.1205
  },

  // ================= MONTREAL LANDMARKS =================
  // Griffintown & Downtown Montreal
  {
    id: 'lm-mo-1',
    name: 'Lachine Canal Historic Park',
    category: 'park',
    address: 'Lachine Canal, Montreal, QC',
    description: '14km urban waterway with waterfront paths, kayak rentals, and converted brick mills.',
    latitude: 45.4880,
    longitude: -73.5645
  },
  {
    id: 'lm-mo-2',
    name: 'Bonaventure Metro Station & Gare Centrale',
    category: 'transit',
    address: '900 Rue de la Gauchetière O, Montreal, QC',
    description: 'Orange Line metro and VIA Rail intercity passenger train gateway.',
    latitude: 45.4998,
    longitude: -73.5670
  },
  {
    id: 'lm-mo-3',
    name: 'Montreal General Hospital (MUHC)',
    category: 'hospital',
    address: '1650 Cedar Ave, Montreal, QC',
    description: 'Tertiary trauma center and university health institution on Mount Royal.',
    latitude: 45.4984,
    longitude: -73.5885
  },
  {
    id: 'lm-mo-4',
    name: 'Sainte-Catherine Luxury Promenade',
    category: 'shopping',
    address: 'Rue Sainte-Catherine, Montreal, QC',
    description: 'Vibrant 11km commercial corridor featuring Ogilvy/Holt Renfrew and Eaton Centre.',
    latitude: 45.5002,
    longitude: -73.5732
  },
  {
    id: 'lm-mo-5',
    name: 'Toqué! Restaurant',
    category: 'restaurant',
    address: '900 Jean-Paul-Riopelle, Montreal, QC',
    description: 'Pioneering Quebec gastronomy by Chef Normand Laprise celebrating regional terroir.',
    latitude: 45.5034,
    longitude: -73.5604
  },
  {
    id: 'lm-mo-6',
    name: 'McGill University',
    category: 'school',
    address: '845 Sherbrooke St W, Montreal, QC',
    description: 'World-renowned historic university campus at the foot of Mount Royal.',
    latitude: 45.5048,
    longitude: -73.5772
  },
  {
    id: 'lm-mo-7',
    name: 'Montreal Museum of Fine Arts',
    category: 'culture',
    address: '1380 Sherbrooke St W, Montreal, QC',
    description: 'Canada’s oldest art institution showcasing international masterpieces.',
    latitude: 45.4986,
    longitude: -73.5794
  },

  // ================= OTTAWA LANDMARKS =================
  // Westboro & Downtown Ottawa
  {
    id: 'lm-ot-1',
    name: 'Westboro Beach & Ottawa River Pathway',
    category: 'park',
    address: 'Kitchissippi Lookout, Ottawa, ON',
    description: 'Riverside sandy beach with boardwalk and sunset lookouts along the Ottawa River.',
    latitude: 45.3970,
    longitude: -75.7602
  },
  {
    id: 'lm-ot-2',
    name: 'Westboro O-Train / Transitway Station',
    category: 'transit',
    address: 'Scott St & Athlone Ave, Ottawa, ON',
    description: 'Rapid transit hub connecting directly to Tunney’s Pasture and downtown core.',
    latitude: 45.3962,
    longitude: -75.7538
  },
  {
    id: 'lm-ot-3',
    name: 'The Ottawa Hospital Civic Campus',
    category: 'hospital',
    address: '1053 Carling Ave, Ottawa, ON',
    description: 'Eastern Ontario’s leading Level 1 trauma and specialized surgical center.',
    latitude: 45.3925,
    longitude: -75.7230
  },
  {
    id: 'lm-ot-4',
    name: 'Westboro Village Shopping District',
    category: 'shopping',
    address: 'Richmond Rd, Ottawa, ON',
    description: 'Chic tree-lined avenue filled with upscale outdoor gear, boutiques, and bakeries.',
    latitude: 45.3920,
    longitude: -75.7540
  },
  {
    id: 'lm-ot-5',
    name: 'Gezellig Dining Lounge',
    category: 'restaurant',
    address: '337 Richmond Rd, Ottawa, ON',
    description: 'Contemporary European-inspired bistro in a converted 1950s bank building.',
    latitude: 45.3915,
    longitude: -75.7535
  },
  {
    id: 'lm-ot-6',
    name: 'Westboro Academy',
    category: 'school',
    address: '200 Brewer Way, Ottawa, ON',
    description: 'Private bilingual preparatory academy providing excellence in dual-immersion.',
    latitude: 45.3855,
    longitude: -75.6980
  },
  {
    id: 'lm-ot-7',
    name: 'National Gallery of Canada',
    category: 'culture',
    address: '380 Sussex Dr, Ottawa, ON',
    description: 'Glass-and-granite architectural masterpiece housing Canada’s national art heritage.',
    latitude: 45.4295,
    longitude: -75.6989
  },

  // ================= CALGARY LANDMARKS =================
  // Beltline & Downtown Calgary
  {
    id: 'lm-ca-1',
    name: 'Central Memorial Park',
    category: 'park',
    address: '1221 2 St SW, Calgary, AB',
    description: 'Calgary’s oldest Victorian park with geometric flowerbeds, fountains, and library.',
    latitude: 45.0415,
    longitude: -114.0685
  },
  {
    id: 'lm-ca-2',
    name: '8th Street SW CTrain Station',
    category: 'transit',
    address: '8th St & 7th Ave SW, Calgary, AB',
    description: 'Free-fare zone light rail transit connecting throughout the downtown core.',
    latitude: 51.0468,
    longitude: -114.0792
  },
  {
    id: 'lm-ca-3',
    name: 'Sheldon M. Chumir Health Centre',
    category: 'hospital',
    address: '1213 4 St SW, Calgary, AB',
    description: '24/7 urgent care and community healthcare facility in the Beltline.',
    latitude: 51.0416,
    longitude: -114.0720
  },
  {
    id: 'lm-ca-4',
    name: '17th Avenue Retail & Entertainment District',
    category: 'shopping',
    address: '17th Ave SW, Calgary, AB',
    description: 'Energetic strip of indie fashion stores, design shops, and cocktail lounges.',
    latitude: 51.0378,
    longitude: -114.0770
  },
  {
    id: 'lm-ca-5',
    name: 'Major Tom Bar & Dining',
    category: 'restaurant',
    address: '700 2 St SW 40th Floor, Calgary, AB',
    description: '40th-floor skyline cocktail lounge and steakhouse voted Canada’s Best New Restaurant.',
    latitude: 51.0470,
    longitude: -114.0670
  },
  {
    id: 'lm-ca-6',
    name: 'Western Canada High School',
    category: 'school',
    address: '641 17 Ave SW, Calgary, AB',
    description: 'Top academic composite high school renowned for International Baccalaureate (IB).',
    latitude: 51.0372,
    longitude: -114.0765
  },
  {
    id: 'lm-ca-7',
    name: 'Glenbow Museum & Arts Commons',
    category: 'culture',
    address: '130 9 Ave SE, Calgary, AB',
    description: 'Western Canada’s largest art and history museum with newly renovated pavilion.',
    latitude: 51.0450,
    longitude: -114.0600
  }
];

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates human travel durations based on straight-line urban road approximation
 */
export function estimateTravelTimes(distanceKm: number) {
  // Walking: ~4.8 km/h
  const walkMinutes = Math.round((distanceKm / 4.8) * 60);
  const walkTime = walkMinutes <= 1 ? '1 min walk' : `${walkMinutes} min walk`;

  // Driving: ~32 km/h in city traffic
  const driveMinutes = Math.max(1, Math.round((distanceKm / 32) * 60));
  const driveTime = `${driveMinutes} min drive`;

  // Transit: ~20 km/h with stops
  const transitMinutes = Math.max(2, Math.round((distanceKm / 20) * 60));
  const transitTime = `${transitMinutes} min transit`;

  const formattedDistance =
    distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;

  return {
    distance: formattedDistance,
    distanceKm: Number(distanceKm.toFixed(2)),
    walkTime,
    driveTime,
    transitTime
  };
}

/**
 * Retrieves all nearby landmarks for a given property within maxRadiusKm, optionally filtered by category
 */
export function getNearbyLandmarksForProperty(
  property: Property,
  categoryFilter?: LandmarkCategory | 'all',
  maxRadiusKm = 25
): Landmark[] {
  if (!property.latitude || !property.longitude) return [];

  const propertyLat = property.latitude;
  const propertyLon = property.longitude;

  return ALL_LANDMARKS
    .filter((landmark) => {
      if (categoryFilter && categoryFilter !== 'all' && landmark.category !== categoryFilter) {
        return false;
      }
      const dist = calculateDistanceKm(propertyLat, propertyLon, landmark.latitude, landmark.longitude);
      return dist <= maxRadiusKm;
    })
    .map((landmark) => {
      const dist = calculateDistanceKm(propertyLat, propertyLon, landmark.latitude, landmark.longitude);
      const metrics = estimateTravelTimes(dist);
      return {
        ...landmark,
        ...metrics
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

/**
 * Finds geographically nearest sister properties (e.g. for property details recommendations)
 */
export function getNearbyProperties(
  property: Property,
  allProperties: Property[],
  maxCount = 3
): (Property & { distance?: string; distanceKm?: number })[] {
  if (!property.latitude || !property.longitude) {
    // Fallback: match by city
    return allProperties
      .filter((p) => p.id !== property.id && p.city.toLowerCase() === property.city.toLowerCase())
      .slice(0, maxCount);
  }

  return allProperties
    .filter((p) => p.id !== property.id && p.latitude && p.longitude)
    .map((p) => {
      const dist = calculateDistanceKm(
        property.latitude!,
        property.longitude!,
        p.latitude!,
        p.longitude!
      );
      const metrics = estimateTravelTimes(dist);
      return {
        ...p,
        distance: metrics.distance,
        distanceKm: metrics.distanceKm
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    .slice(0, maxCount);
}
