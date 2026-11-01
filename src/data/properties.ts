import type { Property } from '../types/property';

export const properties: Property[] = [
  {
    id: 'prop-1',
    title: 'Skyline Residences',
    city: 'Toronto',
    neighborhood: 'North York',
    location: 'North York, Toronto',
    address: '5000 Yonge St, North York, ON M2N 7E9',
    latitude: 43.7615,
    longitude: -79.4111,
    price: 2350,
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    featured: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Offering panoramic elevated views of the North York skyline, this premium suite delivers a modern open kitchen layout, elegant stone quartz benchtops, and automated keyless door entry. Perfect for active couples and transit-oriented professionals.',
    deposit: 2350,
    applicationFee: 50,
    utilities: ['Water & Sewage service included', 'Locker unit included', 'Heating gas included', 'Power metered separately'],
    amenities: ['Parking', 'Gym', 'Balcony', 'Elevator', 'Security'],
    floorPlans: [
      {
        name: 'The Horizon Flat (Plan A)',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1250,
        rent: 2350,
        deposit: 2350,
        description: 'An open-concept living flat featuring separated dual suites for noise privacy, a centralized culinary cooking island, and dedicated parking.',
        rooms: [
          { name: 'Master Bedroom', size: "15' x 12'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "12' x 11'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Living Room', size: "18' x 14'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchen', size: "12' x 10'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' },
          { name: 'Dining Area', size: "10' x 10'", color: 'bg-teal-500/10 border-teal-500/20 text-teal-700' },
          { name: 'Balcony', size: "10' x 6'", color: 'bg-amber-500/10 border-amber-500/20 text-amber-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-2',
    title: 'Maple Heights',
    city: 'Toronto',
    neighborhood: 'Liberty Village',
    location: 'Liberty Village, Toronto',
    address: '85 E Liberty St, Toronto, ON M6K 3R4',
    latitude: 43.6375,
    longitude: -79.4190,
    price: 2800,
    type: 'Condo',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 820,
    featured: true,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Located in the artistic heart of Liberty Village, this modern industrial condo features original concrete pillars, floor-to-ceiling windows, and premium custom furnishings. Includes access to a private resident rooftop terrace.',
    deposit: 2800,
    applicationFee: 75,
    utilities: ['High-speed Fiber Internet included', 'Water, Sewer & Trash included', 'Power metered'],
    amenities: ['Parking', 'Gym', 'Pet Friendly', 'Balcony', 'Rooftop Terrace', 'Furnished'],
    floorPlans: [
      {
        name: 'The Maple Corner (Plan A)',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 820,
        rent: 2800,
        deposit: 2800,
        description: 'Premium corner flat layout showcasing wrap-around glazing, deep bedroom wardrobes, and built-in workstation desk.',
        rooms: [
          { name: 'Bedroom', size: "13' x 11'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Living Room', size: "16' x 12'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchen', size: "10' x 8'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' },
          { name: 'Dining Area', size: "8' x 8'", color: 'bg-teal-500/10 border-teal-500/20 text-teal-700' },
          { name: 'Balcony', size: "8' x 5'", color: 'bg-amber-500/10 border-amber-500/20 text-amber-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-3',
    title: 'Harbour View Apartments',
    city: 'Vancouver',
    neighborhood: 'Coal Harbour',
    location: 'Coal Harbour, Vancouver',
    address: '1155 W Pender St, Vancouver, BC V6E 2P4',
    latitude: 49.2890,
    longitude: -123.1235,
    price: 3400,
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1650,
    featured: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672090437-048b7a486450?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A spectacular penthouse level suite looking directly over Coal Harbour and the North Shore mountains. Features double-height vaulted ceilings, white-veined marble baths, high-end Sub-Zero and Wolf cooking utilities, and a covered glass terrace.',
    deposit: 3400,
    applicationFee: 75,
    utilities: ['24/7 Butler parcel support included', 'Underground security parking included', 'Water, Sewage & gas included', 'Power metered'],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Balcony', 'Elevator', 'Security', 'Rooftop Terrace'],
    floorPlans: [
      {
        name: 'The Harbour Penthouse (Plan A)',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1650,
        rent: 3400,
        deposit: 3400,
        description: 'Elite top-floor layout combining master suite retreats, guest rooms, and an expansive harbor-facing social salon.',
        rooms: [
          { name: 'Master Bedroom', size: "16' x 14'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "13' x 12'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Bedroom 3', size: "12' x 11'", color: 'bg-teal-500/10 border-teal-500/20 text-teal-700' },
          { name: 'Living Room', size: "20' x 16'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchen', size: "14' x 12'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' },
          { name: 'Dining Area', size: "12' x 10'", color: 'bg-purple-500/10 border-purple-500/20 text-purple-700' },
          { name: 'Balcony', size: "12' x 8'", color: 'bg-amber-500/10 border-amber-500/20 text-amber-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-4',
    title: 'Emerald Towers',
    city: 'Vancouver',
    neighborhood: 'Yaletown',
    location: 'Yaletown, Vancouver',
    address: '1008 Mainland St, Vancouver, BC V6B 2T9',
    latitude: 49.2748,
    longitude: -123.1216,
    price: 3100,
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    featured: true,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672545388-7d86b48d6c5e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527030280862-64139fbe04ca?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Perfect for contemporary lifestyle seekers, this high-end apartment in Yaletown offers integrated appliances, smart room temperature setups, a swimming pool deck access, and secure keyless access.',
    deposit: 3100,
    applicationFee: 50,
    utilities: ['Water, Sewer & Trash collection included', 'Underground parking bay included', 'Power metered separately'],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Pet Friendly', 'Elevator', 'Security'],
    floorPlans: [
      {
        name: 'The Emerald Suite (Plan A)',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1250,
        rent: 3100,
        deposit: 3100,
        description: 'Sleek suite design separating bedroom quarters with an elegant kitchen cooking bar and open living room.',
        rooms: [
          { name: 'Master Room', size: "12' x 16'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "11' x 12'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Living Room', size: "16' x 18'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Chef Kitchen', size: "10' x 12'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-5',
    title: 'Royal Oak Residences',
    city: 'Montreal',
    neighborhood: 'Griffintown',
    location: 'Griffintown, Montreal',
    address: '225 Rue Peel, Montréal, QC H3C 2G9',
    latitude: 45.4925,
    longitude: -73.5601,
    price: 2150,
    type: 'Condo',
    bedrooms: 1,
    bathrooms: 1.5,
    sqft: 820,
    featured: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672090437-048b7a486450?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'A gorgeously furnished modern loft condo in Griffintown, featuring high loft timber frames, hardwood floorings, and full biometric security. Perfect for urban individuals seeking instant relocation solutions.',
    deposit: 2150,
    applicationFee: 50,
    utilities: ['Water & Trash collection included', 'Central heating included', 'High-speed fiber Wifi included', 'Electricity metered'],
    amenities: ['Gym', 'Pet Friendly', 'Elevator', 'Security', 'Furnished'],
    floorPlans: [
      {
        name: 'The Griffintown Flat (Plan A)',
        bedrooms: 1,
        bathrooms: 1.5,
        sqft: 820,
        rent: 2150,
        deposit: 2150,
        description: 'An open-concept one-bedroom layout optimized for workspace integration and direct kitchen access.',
        rooms: [
          { name: 'Master Bed', size: "12' x 15'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Living Lounge', size: "14' x 16'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Galley Kitchen', size: "8' x 11'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-6',
    title: 'Riverfront Living',
    city: 'Ottawa',
    neighborhood: 'Westboro',
    location: 'Westboro, Ottawa',
    address: '380 Richmond Rd, Ottawa, ON K1Z 6X9',
    latitude: 45.3912,
    longitude: -75.7533,
    price: 2250,
    type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1600,
    featured: false,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Nestled in the prestigious Westboro community, this executive townhouse offers private garden access, walnut wood finishings, brick feature walls, and a private double-car garage. Rear glass walls open directly to a patio overlooking the Ottawa River parkway.',
    deposit: 2250,
    applicationFee: 60,
    utilities: ['Gardener & Landscaping service included', 'Trash collection included', 'Gas & Power metered separately'],
    amenities: ['Parking', 'Pet Friendly', 'Balcony', 'Security', 'Rooftop Terrace'],
    floorPlans: [
      {
        name: 'The Westboro Townhome (Plan A)',
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 1600,
        rent: 2250,
        deposit: 2250,
        description: 'A multi-story layout keeping bedrooms upstairs, separate from the downstairs family entertaining rooms.',
        rooms: [
          { name: 'Master Retreat', size: "14' x 16'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "11' x 12'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Bedroom 3', size: "10' x 11'", color: 'bg-teal-500/10 border-teal-500/20 text-teal-700' },
          { name: 'Family Salon', size: "16' x 18'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchen bar', size: "11' x 12'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-7',
    title: 'Aurora Heights',
    city: 'Calgary',
    neighborhood: 'Beltline',
    location: 'Beltline, Calgary',
    address: '1210 11 Ave SW, Calgary, AB T3C 0M6',
    latitude: 51.0410,
    longitude: -114.0730,
    price: 2000,
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 720,
    featured: false,
    image: 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Sleek design and smart spacing form this Beltline flat. Offers keyless secure entries, a modern kitchen bar, and immediate access to downtown Calgary co-working lounges and transit hubs.',
    deposit: 2000,
    applicationFee: 50,
    utilities: ['Water, Sewer & Trash included', 'Internet ready', 'Power & Heating metered separately'],
    amenities: ['Parking', 'Gym', 'Pet Friendly', 'Elevator', 'Security'],
    floorPlans: [
      {
        name: 'The Aurora Flat (Plan A)',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 720,
        rent: 2000,
        deposit: 2000,
        description: 'Comfortable studio apartment with sliding privacy partitions separating the sleeping quarters from the main kitchen and media room.',
        rooms: [
          { name: 'Sleeping Niche', size: "11' x 13'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Living Room', size: "14' x 16'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchenette', size: "8' x 10'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-8',
    title: 'Cedar Park Apartments',
    city: 'Toronto',
    neighborhood: 'Scarborough',
    location: 'Scarborough, Toronto',
    address: '180 Markham Rd, Scarborough, ON M1M 2Z9',
    latitude: 43.7764,
    longitude: -79.2318,
    price: 1950,
    type: 'Apartment',
    bedrooms: 0, // Studio
    bathrooms: 1,
    sqft: 540,
    featured: false,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672545388-7d86b48d6c5e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'An exceptionally structured studio apartment in Scarborough, offering large floor-to-ceiling windows, smart heating, and pet friendly terms. Quiet residential building overlooking green ravine pathways.',
    deposit: 1950,
    applicationFee: 40,
    utilities: ['Water, Sewer & Trash collection included', 'Heating gas included', 'Power metered separately'],
    amenities: ['Parking', 'Elevator', 'Security', 'Pet Friendly'],
    floorPlans: [
      {
        name: 'The Scarborough Studio (Plan A)',
        bedrooms: 0,
        bathrooms: 1,
        sqft: 540,
        rent: 1950,
        deposit: 1950,
        description: 'An open-concept layout containing kitchen appliances and wardrobe panels, optimized for spacing efficiency.',
        rooms: [
          { name: 'Combined Studio', size: "16' x 20'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Kitchenette', size: "8' x 10'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-9',
    title: 'Lakeside Towers',
    city: 'Toronto',
    neighborhood: 'Etobicoke',
    location: 'Etobicoke, Toronto',
    address: '68 Marine Parade Dr, Etobicoke, ON M8V 1A1',
    latitude: 43.6205,
    longitude: -79.4790,
    price: 2450,
    type: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    featured: false,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Directly overlooking Lake Ontario in Etobicoke, this modern condo offers an open kitchen layout, swimming pool access, and elevator lobbies. Features hard timber flooring, integrated appliances, and a lake-view balcony.',
    deposit: 2450,
    applicationFee: 50,
    utilities: ['Water, Sewer & Trash included', 'Central heating gas included', 'Power metered separately'],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Balcony', 'Elevator'],
    floorPlans: [
      {
        name: 'The Lakeview Corner (Plan A)',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1050,
        rent: 2450,
        deposit: 2450,
        description: 'Corner suite layout with bedrooms separated by a central kitchen island and a covered lakefront veranda.',
        rooms: [
          { name: 'Master Room', size: "12' x 15'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "11' x 12'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Living Hall', size: "15' x 18'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Lake Veranda', size: "6' x 12'", color: 'bg-amber-500/10 border-amber-500/20 text-amber-700' }
        ]
      }
    ]
  },
  {
    id: 'prop-10',
    title: 'Elite Residences',
    city: 'Vancouver',
    neighborhood: 'Kitsilano',
    location: 'Kitsilano, Vancouver',
    address: '2150 W 4th Ave, Vancouver, BC V6K 1N6',
    latitude: 49.2684,
    longitude: -123.1682,
    price: 3250,
    type: 'Townhouse',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1550,
    featured: true,
    image: 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'This prime Kitsilano townhouse offers quick beachside access, solid hardwood floorings, automated security systems, and high vaulted ceilings. Rear doors open to a fully fenced patio yard.',
    deposit: 3250,
    applicationFee: 75,
    utilities: ['Gardener & Landscaping service included', 'Trash pickup included', 'Power, Gas & Water metered separately'],
    amenities: ['Parking', 'Pet Friendly', 'Balcony', 'Security', 'Rooftop Terrace', 'Furnished'],
    floorPlans: [
      {
        name: 'The Kitsilano Flat (Plan A)',
        bedrooms: 3,
        bathrooms: 3,
        sqft: 1550,
        rent: 3250,
        deposit: 3250,
        description: 'Fabulous three-bedroom layout separating guest suites from the master wing with a central hearth salon.',
        rooms: [
          { name: 'Master Suite', size: "14' x 16'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
          { name: 'Bedroom 2', size: "11' x 12'", color: 'bg-sky-500/10 border-sky-500/20 text-sky-700' },
          { name: 'Bedroom 3', size: "10' x 11'", color: 'bg-teal-500/10 border-teal-500/20 text-teal-700' },
          { name: 'Hearth Salon', size: "18' x 16'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
          { name: 'Patio Deck', size: "8' x 12'", color: 'bg-amber-500/10 border-amber-500/20 text-amber-700' }
        ]
      }
    ]
  }
];
