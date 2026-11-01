import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  Check, 
  X, 
  LayoutGrid, 
  Columns, 
  Map, 
  Compass, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { getPublicProperties } from '../utils/db';
import { ALL_LANDMARKS } from '../data/landmarks';
import type { Property, LandmarkCategory } from '../types/property';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/map/PropertyMap';
import LandmarkCategoryChips from '../components/map/LandmarkCategoryChips';

// Extended client amenities list
const ALL_AMENITIES = [
  'Parking',
  'Gym',
  'Swimming Pool',
  'Pet Friendly',
  'Balcony',
  'Elevator',
  'Security',
  'Rooftop Terrace',
  'Furnished',
  'Concierge Service',
  'Wine Cellar',
  'Smart Home System',
  'Private Storage Locker',
  'Electric Vehicle Charger'
];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  // View Mode: 'grid' (classic catalog), 'split' (map + cards side-by-side), 'map' (full map with overlay cards)
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('split');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedBathrooms, setSelectedBathrooms] = useState('');
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minSqft, setMinSqft] = useState(400);
  const [maxSqft, setMaxSqft] = useState(3000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [listingStatus, setListingStatus] = useState<string>('active');
  const [sortBy, setSortBy] = useState('featured');
  
  // Map and Selection Synchronization
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  
  // Landmark Discovery on Map
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [selectedLandmarkCategory, setSelectedLandmarkCategory] = useState<LandmarkCategory | 'all'>('all');

  // Mobile drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Populate filters from URL Search Params on load
  useEffect(() => {
    setAllProperties(getPublicProperties());
    
    const loc = searchParams.get('location');
    const t = searchParams.get('type');
    const beds = searchParams.get('bedrooms');
    const pr = searchParams.get('price');
    const minPr = searchParams.get('minPrice');
    const q = searchParams.get('q');
    const view = searchParams.get('view');

    if (loc) setSelectedLocation(loc.toLowerCase());
    if (t) setSelectedType(t.toLowerCase());
    if (beds) setSelectedBedrooms(beds);
    if (pr) setMaxPrice(Number(pr));
    if (minPr) setMinPrice(Number(minPr));
    if (q) setSearchQuery(q);
    if (view && (view === 'grid' || view === 'split' || view === 'map')) {
      setViewMode(view);
    }
  }, [searchParams]);

  // Handle toggling of amenities checkboxes
  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedNeighborhood('');
    setSelectedType('');
    setSelectedBedrooms('');
    setSelectedBathrooms('');
    setMinPrice(1000);
    setMaxPrice(5000);
    setMinSqft(400);
    setMaxSqft(3000);
    setSelectedAmenities([]);
    setListingStatus('active');
    setSortBy('featured');
    setSelectedPropertyId(null);
    setSearchParams({});
  };

  // Available neighborhoods based on selected city
  const availableNeighborhoods = Array.from(
    new Set(
      allProperties
        .filter((p) => !selectedLocation || p.city.toLowerCase() === selectedLocation.toLowerCase())
        .map((p) => p.neighborhood)
    )
  ).sort();

  // Filter properties
  const filteredProperties = allProperties.filter((property) => {
    // 1. Text Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = property.title.toLowerCase().includes(q);
      const matchCity = property.city.toLowerCase().includes(q);
      const matchNeigh = property.neighborhood.toLowerCase().includes(q);
      const matchAddress = property.address?.toLowerCase().includes(q) || false;
      const matchDesc = property.description?.toLowerCase().includes(q) || false;
      const matchAmenity = property.amenities.some(a => a.toLowerCase().includes(q));
      if (!matchTitle && !matchCity && !matchNeigh && !matchAddress && !matchDesc && !matchAmenity) return false;
    }

    // 2. City Filter
    if (selectedLocation) {
      if (property.city.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    }

    // 3. Neighborhood Filter
    if (selectedNeighborhood) {
      if (property.neighborhood.toLowerCase() !== selectedNeighborhood.toLowerCase()) return false;
    }

    // 4. Property Type
    if (selectedType) {
      if (property.type.toLowerCase() !== selectedType.toLowerCase()) return false;
    }

    // 5. Bedrooms
    if (selectedBedrooms) {
      if (selectedBedrooms === '3') {
        if (property.bedrooms < 3) return false;
      } else if (property.bedrooms !== Number(selectedBedrooms)) {
        return false;
      }
    }

    // 6. Bathrooms
    if (selectedBathrooms) {
      if (selectedBathrooms === '3') {
        if (property.bathrooms < 3) return false;
      } else if (property.bathrooms < Number(selectedBathrooms)) {
        return false;
      }
    }

    // 7. Price Range
    if (property.price < minPrice || property.price > maxPrice) return false;

    // 8. Square Footage Range
    if (property.sqft < minSqft || property.sqft > maxSqft) return false;

    // 9. Amenities
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every(a => property.amenities.includes(a));
      if (!hasAll) return false;
    }

    // 10. Status Filter
    if (listingStatus && listingStatus !== 'all') {
      if (property.status && property.status !== listingStatus) return false;
    }

    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'size-desc') return b.sqft - a.sqft;
    if (sortBy === 'newest') {
      return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
    }
    // 'featured' sorting
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    return a.id.localeCompare(b.id);
  });

  // Scroll to property card when marker is clicked on map
  const handlePropertySelectFromMap = (property: Property) => {
    setSelectedPropertyId(property.id);
    const cardEl = cardRefs.current[property.id];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getCleanLabel = (key: string, value: string) => {
    if (key === 'location') return `City: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
    if (key === 'neighborhood') return `Area: ${value}`;
    if (key === 'type') return `Type: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
    if (key === 'bedrooms') {
      if (value === '0') return 'Studio';
      return `${value} Bed${Number(value) > 1 ? 's' : ''}`;
    }
    if (key === 'bathrooms') return `${value}+ Baths`;
    if (key === 'price') return `Budget: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()} CAD`;
    if (key === 'sqft') return `Size: ${minSqft} - ${maxSqft} sq ft`;
    return value;
  };

  const hasActiveFilters = 
    Boolean(selectedLocation) ||
    Boolean(selectedNeighborhood) ||
    Boolean(selectedType) ||
    Boolean(selectedBedrooms) ||
    Boolean(selectedBathrooms) ||
    minPrice > 1000 ||
    maxPrice < 5000 ||
    minSqft > 400 ||
    maxSqft < 3000 ||
    selectedAmenities.length > 0 ||
    Boolean(searchQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Interactive Residences Map & Search
          </span>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Exclusive Living Portfolio
          </h1>
          <p className="text-sm text-slate-500 font-light max-w-2xl mt-1">
            Discover luxury residences with interactive geographic markers, verified layout specifications, and comprehensive nearby neighborhood discovery.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-primary hover:bg-white/50'
            }`}
          >
            <Columns className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-primary hover:bg-white/50'
            }`}
          >
            <LayoutGrid className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Grid Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-primary shadow-md'
                : 'text-slate-500 hover:text-primary hover:bg-white/50'
            }`}
          >
            <Map className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Full Map</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            title="How to Use Map & Search"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-poppins font-semibold text-slate-600 bg-white hover:text-accent hover:border-accent border border-slate-200 shadow-xs transition-all cursor-pointer ml-1"
          >
            <HelpCircle className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Map Guide</span>
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= DESKTOP SIDEBAR FILTERS (3 Cols) ================= */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-100 shadow-premium rounded-3xl p-6 space-y-6 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-poppins font-bold text-primary text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-accent flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Text Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Toronto, Waterfront, gym..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Location / City */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setSelectedNeighborhood('');
              }}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
            >
              <option value="">All Cities</option>
              <option value="toronto">Toronto</option>
              <option value="vancouver">Vancouver</option>
              <option value="montreal">Montreal</option>
              <option value="calgary">Calgary</option>
              <option value="ottawa">Ottawa</option>
            </select>
          </div>

          {/* Specific Neighborhood */}
          {availableNeighborhoods.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Neighborhood</label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
              >
                <option value="">All Neighborhoods</option>
                {availableNeighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="penthouse">Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          {/* Bedrooms Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Bedrooms</span>
              {selectedBedrooms && (
                <button onClick={() => setSelectedBedrooms('')} className="text-accent hover:underline text-[9px]">
                  Any
                </button>
              )}
            </label>
            <div className="grid grid-cols-5 gap-1">
              {['', '0', '1', '2', '3'].map((beds) => (
                <button
                  key={beds}
                  type="button"
                  onClick={() => setSelectedBedrooms(beds)}
                  className={`py-2 rounded-lg text-xs font-bold font-poppins border transition-all cursor-pointer ${
                    selectedBedrooms === beds
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {beds === '' ? 'Any' : beds === '0' ? 'St' : beds === '3' ? '3+' : beds}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Bathrooms</span>
              {selectedBathrooms && (
                <button onClick={() => setSelectedBathrooms('')} className="text-accent hover:underline text-[9px]">
                  Any
                </button>
              )}
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['', '1', '2', '3'].map((baths) => (
                <button
                  key={baths}
                  type="button"
                  onClick={() => setSelectedBathrooms(baths)}
                  className={`py-2 rounded-lg text-xs font-bold font-poppins border transition-all cursor-pointer ${
                    selectedBathrooms === baths
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {baths === '' ? 'Any' : `${baths}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">Max Budget</span>
              <span className="text-accent-dark font-poppins font-extrabold">${maxPrice.toLocaleString()} CAD</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>$1,000</span>
              <span>$5,000+ CAD</span>
            </div>
          </div>

          {/* Square Footage Range */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400">Max Size</span>
              <span className="text-accent-dark font-poppins font-extrabold">{maxSqft.toLocaleString()} sq ft</span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={maxSqft}
              onChange={(e) => setMaxSqft(Number(e.target.value))}
              className="w-full accent-accent h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>500 sq ft</span>
              <span>3,000+ sq ft</span>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amenities</label>
              {selectedAmenities.length > 0 && (
                <span className="text-[10px] font-bold text-accent">
                  {selectedAmenities.length} selected
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {ALL_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none group"
                  >
                    <div 
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`h-4.5 w-4.5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        isChecked 
                          ? 'bg-accent border-accent text-primary' 
                          : 'border-slate-200 bg-white group-hover:border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="font-light truncate">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA (9 Cols) ================= */}
        <main className="col-span-1 lg:col-span-9 space-y-6">
          {/* Top Actions Bar: Counter, Sort, Mobile Map Toggle */}
          <div className="bg-white border border-slate-100 shadow-premium rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-500 font-light text-center sm:text-left">
              Showing <strong className="font-bold text-primary">{sortedProperties.length}</strong> of{' '}
              <strong className="font-semibold text-slate-600">{allProperties.length}</strong> exclusive residences
            </span>

            {/* Sorting & Filter Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Landmark POI Map Toggle */}
              <button
                type="button"
                onClick={() => setShowLandmarks(!showLandmarks)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-poppins font-medium border transition-all cursor-pointer ${
                  showLandmarks
                    ? 'bg-accent/15 border-accent text-accent-dark font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Compass className="h-3.5 w-3.5 text-accent" />
                <span className="hidden sm:inline">Nearby POIs</span>
              </button>

              <span className="text-xs text-slate-400 font-light shrink-0 hidden md:inline">Sort By</span>
              <div className="relative w-full sm:w-44">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all appearance-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="size-desc">Size: Largest First</option>
                  <option value="newest">Newest Listed</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('location', selectedLocation)}
                  <button onClick={() => setSelectedLocation('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedNeighborhood && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('neighborhood', selectedNeighborhood)}
                  <button onClick={() => setSelectedNeighborhood('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedType && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('type', selectedType)}
                  <button onClick={() => setSelectedType('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedBedrooms && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('bedrooms', selectedBedrooms)}
                  <button onClick={() => setSelectedBedrooms('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedBathrooms && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('bathrooms', selectedBathrooms)}
                  <button onClick={() => setSelectedBathrooms('')} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {maxPrice < 5000 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('price', maxPrice.toString())}
                  <button onClick={() => setMaxPrice(5000)} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {maxSqft < 3000 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {getCleanLabel('sqft', maxSqft.toString())}
                  <button onClick={() => setMaxSqft(3000)} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedAmenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-medium text-accent-dark">
                  {amenity}
                  <button onClick={() => handleAmenityToggle(amenity)} className="hover:text-red-500 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-slate-400 hover:text-accent transition-colors ml-1 cursor-pointer flex items-center gap-0.5"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Landmark Category Switcher (Visible when POIs are enabled) */}
          {showLandmarks && (
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-poppins font-bold text-primary flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-accent" /> Landmark Categories on Map
                </span>
                <span className="text-[10px] text-slate-400">
                  Showing {ALL_LANDMARKS.length} landmarks across Canadian metros
                </span>
              </div>
              <LandmarkCategoryChips
                selectedCategory={selectedLandmarkCategory}
                onSelectCategory={setSelectedLandmarkCategory}
                size="sm"
              />
            </div>
          )}

          {/* ================= VIEW MODE 1: SPLIT VIEW (MAP + LISTINGS) ================= */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Top Interactive Map Canvas (6 cols) */}
              <div className="lg:col-span-6 lg:sticky lg:top-28">
                <PropertyMap
                  properties={sortedProperties}
                  selectedPropertyId={selectedPropertyId}
                  hoveredPropertyId={hoveredPropertyId}
                  onPropertySelect={handlePropertySelectFromMap}
                  onPropertyHover={setHoveredPropertyId}
                  onCityFocus={(city) => {
                    setSelectedLocation(city);
                    setSelectedNeighborhood('');
                  }}
                  landmarks={ALL_LANDMARKS}
                  showLandmarks={showLandmarks}
                  selectedLandmarkCategory={selectedLandmarkCategory}
                  height={560}
                  className="rounded-3xl shadow-premium"
                />
              </div>

              {/* Right Property Listings Cards (6 cols) */}
              <div className="lg:col-span-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {sortedProperties.length > 0 ? (
                    sortedProperties.map((property) => {
                      const isSelected = selectedPropertyId === property.id;
                      const isHovered = hoveredPropertyId === property.id;

                      return (
                        <div
                          key={property.id}
                          ref={(el) => { cardRefs.current[property.id] = el; }}
                          onMouseEnter={() => setHoveredPropertyId(property.id)}
                          onMouseLeave={() => setHoveredPropertyId(null)}
                          onClick={() => setSelectedPropertyId(property.id)}
                          className={`rounded-2xl transition-all duration-300 ${
                            isSelected ? 'ring-2 ring-accent shadow-xl -translate-y-1' : isHovered ? 'shadow-md -translate-y-0.5' : ''
                          }`}
                        >
                          <PropertyCard property={property} />
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState resetFilters={resetFilters} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ================= VIEW MODE 2: GRID VIEW (CLASSIC CATALOG) ================= */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {sortedProperties.length > 0 ? (
                  sortedProperties.map((property, idx) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState resetFilters={resetFilters} />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ================= VIEW MODE 3: FULL MAP VIEW ================= */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <PropertyMap
                properties={sortedProperties}
                selectedPropertyId={selectedPropertyId}
                hoveredPropertyId={hoveredPropertyId}
                onPropertySelect={handlePropertySelectFromMap}
                onPropertyHover={setHoveredPropertyId}
                onCityFocus={(city) => {
                  setSelectedLocation(city);
                  setSelectedNeighborhood('');
                }}
                landmarks={ALL_LANDMARKS}
                showLandmarks={showLandmarks}
                selectedLandmarkCategory={selectedLandmarkCategory}
                height={620}
                className="rounded-3xl shadow-premium"
              />

              {/* Bottom Horizontal Residence Carousel */}
              {sortedProperties.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-poppins font-bold text-primary">
                      Matching Properties ({sortedProperties.length})
                    </span>
                    <span className="text-slate-400 text-[11px]">Click or hover to highlight on map</span>
                  </div>
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin">
                    {sortedProperties.map((property) => (
                      <div
                        key={property.id}
                        onMouseEnter={() => setHoveredPropertyId(property.id)}
                        onMouseLeave={() => setHoveredPropertyId(null)}
                        onClick={() => setSelectedPropertyId(property.id)}
                        className={`w-72 shrink-0 rounded-2xl transition-all duration-300 ${
                          selectedPropertyId === property.id ? 'ring-2 ring-accent shadow-xl scale-102' : ''
                        }`}
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE SLIDE-OVER FILTER DRAWER ================= */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 lg:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-poppins font-bold text-primary text-base flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-accent" /> Filter Catalog
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Filters Form */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {/* Text Search */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Toronto, Yaletown, gym..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Location / City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setSelectedNeighborhood('');
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
                  >
                    <option value="">All Cities</option>
                    <option value="toronto">Toronto</option>
                    <option value="vancouver">Vancouver</option>
                    <option value="montreal">Montreal</option>
                    <option value="calgary">Calgary</option>
                    <option value="ottawa">Ottawa</option>
                  </select>
                </div>

                {/* Specific Neighborhood */}
                {availableNeighborhoods.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Neighborhood</label>
                    <select
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
                    >
                      <option value="">All Neighborhoods</option>
                      {availableNeighborhoods.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>

                {/* Bedrooms Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedrooms</label>
                  <div className="grid grid-cols-5 gap-1">
                    {['', '0', '1', '2', '3'].map((beds) => (
                      <button
                        key={beds}
                        type="button"
                        onClick={() => setSelectedBedrooms(beds)}
                        className={`py-2 rounded-lg text-xs font-bold font-poppins border transition-all cursor-pointer ${
                          selectedBedrooms === beds
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {beds === '' ? 'Any' : beds === '0' ? 'St' : beds === '3' ? '3+' : beds}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bathrooms</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['', '1', '2', '3'].map((baths) => (
                      <button
                        key={baths}
                        type="button"
                        onClick={() => setSelectedBathrooms(baths)}
                        className={`py-2 rounded-lg text-xs font-bold font-poppins border transition-all cursor-pointer ${
                          selectedBathrooms === baths
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {baths === '' ? 'Any' : `${baths}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">Max Budget</span>
                    <span className="text-accent-dark font-poppins font-extrabold">${maxPrice.toLocaleString()} CAD</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>$1,000</span>
                    <span>$5,000+ CAD</span>
                  </div>
                </div>

                {/* Square Footage Range */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">Max Size</span>
                    <span className="text-accent-dark font-poppins font-extrabold">{maxSqft.toLocaleString()} sq ft</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={maxSqft}
                    onChange={(e) => setMaxSqft(Number(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Amenities checklist */}
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amenities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_AMENITIES.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer select-none"
                        >
                          <div 
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`h-4 w-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
                              isChecked 
                                ? 'bg-accent border-accent text-primary' 
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </div>
                          <span className="font-light truncate">{amenity}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={resetFilters}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-600 py-3 text-xs font-bold font-poppins transition-colors cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full rounded-xl bg-primary text-white py-3 text-xs font-bold font-poppins shadow-md transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= MAP & SEARCH INTERACTIVE USER GUIDE MODAL ================= */}
      <AnimatePresence>
        {showGuideModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3" /> Quick User Guide
                  </span>
                  <h3 className="font-poppins text-2xl font-extrabold text-primary">
                    How to Use the Interactive Map & Search
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-1 leading-relaxed">
                    Explore available suites geographically, find nearby landmarks, and discover your next home with ease.
                  </p>
                </div>

                {/* Feature Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Step 1: Split & Map Views */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-accent text-xs font-bold font-poppins">
                        1
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">Choose Your View</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Toggle between <strong>Split View</strong> (map alongside listings), <strong>Grid Catalog</strong> (cards only), and <strong>Full Map</strong> (large map with bottom slider).
                    </p>
                  </div>

                  {/* Step 2: Interactive Pins */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-primary text-xs font-bold font-poppins">
                        2
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">Click & Hover Markers</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Each gold pin displays the monthly rent. Click any marker to open a preview photo card with key specs and a direct link to the details page.
                    </p>
                  </div>

                  {/* Step 3: Two-Way Sync */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold font-poppins">
                        3
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">2-Way Synchronization</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Hovering a listing card lights up its pin on the map. Clicking a pin scrolls straight to its listing card in the split column.
                    </p>
                  </div>

                  {/* Step 4: Landmark POIs */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold font-poppins">
                        4
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">Discover Nearby POIs</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Click the <strong>Nearby POIs</strong> button to view local schools, transit hubs, hospitals, shopping, parks, and dining with calculated walking times.
                    </p>
                  </div>

                  {/* Step 5: Advanced Filters */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold font-poppins">
                        5
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">Multi-Criteria Filters</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Refine by city, neighborhood, budget slider, bedrooms, bathrooms, square footage, and amenities. Markers update dynamically.
                    </p>
                  </div>

                  {/* Step 6: Map Controls */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white text-xs font-bold font-poppins">
                        6
                      </span>
                      <h4 className="font-poppins font-bold text-xs text-primary">Map Theme & Zoom</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Use the top-right map controls to switch between <strong>Luxury Light</strong> and <strong>Dark mode</strong>, re-center the map, or enter <strong>Fullscreen</strong>.
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowGuideModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-accent hover:text-primary font-poppins font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Got It, Start Exploring
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ resetFilters }: { resetFilters: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full bg-white border border-slate-100 shadow-premium rounded-3xl p-12 text-center max-w-md mx-auto my-8"
    >
      <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <h3 className="font-poppins text-lg font-bold text-primary mb-1">No Residences Found</h3>
      <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
        We couldn't locate any listings matching your active criteria. Try broadening your budget range, changing cities, or clearing filters.
      </p>
      <button
        onClick={resetFilters}
        className="inline-flex items-center justify-center rounded-xl bg-primary text-white hover:bg-accent hover:text-primary px-6 py-2.5 text-xs font-semibold shadow-md transition-all cursor-pointer"
      >
        Reset All Filters
      </button>
    </motion.div>
  );
}
