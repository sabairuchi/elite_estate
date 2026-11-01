import { properties } from './data/properties';
import { 
  ALL_LANDMARKS, 
  calculateDistanceKm, 
  estimateTravelTimes, 
  getNearbyLandmarksForProperty, 
  getNearbyProperties 
} from './data/landmarks';
import { resolveCoordinates } from './utils/db';
import type { LandmarkCategory } from './types/property';

console.log('================================================================');
console.log('  ELITE STATE - MILESTONE 3 INTERACTIVE SEARCH VERIFICATION     ');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}: ${errorMsg || 'Assertion failed'}`);
    failed++;
  }
}

// 1. Property Geographic Coordinates & Addresses
console.log('--- 1. Property Dataset Coordinates & Addresses ---');
assert(properties.length >= 10, `Catalog contains ${properties.length} properties`);

properties.forEach((p) => {
  assert(
    typeof p.latitude === 'number' && p.latitude >= 40 && p.latitude <= 60,
    `Property ${p.id} (${p.title}) has valid Canadian latitude (${p.latitude})`
  );
  assert(
    typeof p.longitude === 'number' && p.longitude >= -140 && p.longitude <= -50,
    `Property ${p.id} (${p.title}) has valid Canadian longitude (${p.longitude})`
  );
  assert(
    Boolean(p.address && p.address.length > 5),
    `Property ${p.id} (${p.title}) has valid full street address: "${p.address}"`
  );
});

// 2. Haversine Distance Calculation
console.log('\n--- 2. Geographic Distance Calculation ---');
// Distance between CN Tower (43.6426, -79.3871) and Yonge-Dundas Square (43.6561, -79.3802) is approx 1.6 km
const distTest = calculateDistanceKm(43.6426, -79.3871, 43.6561, -79.3802);
assert(distTest > 1.3 && distTest < 1.9, `Haversine distance calculation is accurate (${distTest.toFixed(2)} km)`);

// 3. Travel Time Estimation
console.log('\n--- 3. Travel Time Estimations ---');
const travelTimes = estimateTravelTimes(1.5);
assert(travelTimes.walkTime.includes('min walk'), `Walk time is formatted properly: "${travelTimes.walkTime}"`);
assert(travelTimes.driveTime.includes('min drive'), `Drive time is formatted properly: "${travelTimes.driveTime}"`);
assert(travelTimes.transitTime.includes('min transit'), `Transit time is formatted properly: "${travelTimes.transitTime}"`);
assert(travelTimes.distance === '1.5 km', `Distance formatted: "${travelTimes.distance}"`);

const shortDist = estimateTravelTimes(0.4);
assert(shortDist.distance === '400 m', `Short distance formatted in meters: "${shortDist.distance}"`);

// 4. Landmarks Dataset & Categorization
console.log('\n--- 4. Landmarks Dataset Coverage ---');
assert(ALL_LANDMARKS.length >= 20, `Landmarks database contains ${ALL_LANDMARKS.length} curated POIs`);

const categories: LandmarkCategory[] = ['school', 'hospital', 'shopping', 'restaurant', 'park', 'transit', 'culture'];
categories.forEach((cat) => {
  const count = ALL_LANDMARKS.filter((l) => l.category === cat).length;
  assert(count > 0, `Category "${cat}" has ${count} landmarks`);
});

// 5. Nearby Landmarks for Specific Properties
console.log('\n--- 5. Nearby Landmark Discovery for Properties ---');
const prop1 = properties[0]; // Skyline Residences in North York
const nearbyProp1 = getNearbyLandmarksForProperty(prop1, 'all', 20);
assert(nearbyProp1.length > 0, `Property 1 found ${nearbyProp1.length} nearby landmarks within 20km`);
assert(
  nearbyProp1[0].distanceKm !== undefined && nearbyProp1[0].distanceKm <= (nearbyProp1[1]?.distanceKm || 999),
  `Nearby landmarks are sorted ascending by proximity (Closest: ${nearbyProp1[0].name} at ${nearbyProp1[0].distance})`
);

// Filter by schools for prop1
const prop1Schools = getNearbyLandmarksForProperty(prop1, 'school', 20);
assert(prop1Schools.length > 0, `Schools filter returned ${prop1Schools.length} schools near Prop 1`);
prop1Schools.forEach((s) => assert(s.category === 'school', `Landmark "${s.name}" is a school`));

// Filter by transit for prop1
const prop1Transit = getNearbyLandmarksForProperty(prop1, 'transit', 20);
assert(prop1Transit.length > 0, `Transit filter returned ${prop1Transit.length} transit hubs near Prop 1`);

// 6. Nearby Similar Residences
console.log('\n--- 6. Nearby Similar Sister Properties ---');
const sisterProps = getNearbyProperties(prop1, properties, 3);
assert(sisterProps.length === 3, `Returned exactly 3 nearby sister properties`);
assert(!sisterProps.some((p) => p.id === prop1.id), `Current property is excluded from sister list`);
assert(
  sisterProps.every((p) => typeof p.distanceKm === 'number'),
  `All nearby properties include computed distance`
);

// 7. Dynamic Coordinate Resolution Fallback
console.log('\n--- 7. Dynamic Coordinate Resolution for New Agent Listings ---');
const torontoCoords = resolveCoordinates('Toronto', 'North York');
assert(torontoCoords.lat === 43.7615 && torontoCoords.lng === -79.4111, `North York coordinates resolved correctly`);

const vancouverCoords = resolveCoordinates('Vancouver', 'Yaletown');
assert(vancouverCoords.lat === 49.2748 && vancouverCoords.lng === -123.1216, `Yaletown coordinates resolved correctly`);

const fallbackCoords = resolveCoordinates('Unknown City', 'Random Area');
assert(typeof fallbackCoords.lat === 'number' && typeof fallbackCoords.lng === 'number', `Fallback coordinates returned`);

// 8. Multi-Criteria Search Filters Simulation
console.log('\n--- 8. Multi-Criteria Filter Engine Validation ---');
// Filter Vancouver + 2 Beds + Max Price $3200
const multiFilter = properties.filter((p) => {
  if (p.city.toLowerCase() !== 'vancouver') return false;
  if (p.bedrooms !== 2) return false;
  if (p.price > 3200) return false;
  return true;
});
assert(multiFilter.length > 0, `Multi-filter (Vancouver + 2 Beds + Max $3,200) matched ${multiFilter.length} suites`);
assert(multiFilter.every((p) => p.city === 'Vancouver' && p.bedrooms === 2 && p.price <= 3200), `All matches satisfy strict criteria`);

console.log('\n================================================================');
console.log(`  ALL M3 TESTS COMPLETED: ${passed} Passed, ${failed} Failed      `);
console.log('================================================================\n');

if (failed > 0) {
  throw new Error(`${failed} tests failed in M3 suite`);
}
