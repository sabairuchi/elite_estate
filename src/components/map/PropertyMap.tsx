import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { 
  Maximize2, 
  Minimize2, 
  Layers, 
  RotateCcw, 
  Plus, 
  Minus,
  Map as MapIcon,
  Info
} from 'lucide-react';
import type { Property, Landmark, LandmarkCategory } from '../../types/property';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
  onPropertySelect?: (property: Property) => void;
  onPropertyHover?: (propertyId: string | null) => void;
  onCityFocus?: (city: string) => void;
  landmarks?: Landmark[];
  showLandmarks?: boolean;
  selectedLandmarkCategory?: LandmarkCategory | 'all';
  focusProperty?: Property | null;
  radiusKm?: number;
  height?: string | number;
  className?: string;
  zoom?: number;
  center?: [number, number];
  interactive?: boolean;
  showControls?: boolean;
  showCityQuickJump?: boolean;
}

const TILE_PROVIDERS = {
  voyager: {
    name: 'Luxury Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  dark: {
    name: 'Sleek Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  osm: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }
};

const CITY_CENTERS: Record<string, { name: string; center: [number, number]; zoom: number }> = {
  toronto: { name: 'Toronto', center: [43.695, -79.395], zoom: 12 },
  vancouver: { name: 'Vancouver', center: [49.278, -123.135], zoom: 13 },
  montreal: { name: 'Montreal', center: [45.498, -73.568], zoom: 13 },
  ottawa: { name: 'Ottawa', center: [45.395, -75.745], zoom: 13 },
  calgary: { name: 'Calgary', center: [51.043, -114.072], zoom: 13 }
};

const LANDMARK_CATEGORY_COLORS: Record<LandmarkCategory, { bg: string; text: string; iconEmoji: string }> = {
  school: { bg: '#2563eb', text: '#ffffff', iconEmoji: '🎓' },
  hospital: { bg: '#e11d48', text: '#ffffff', iconEmoji: '🏥' },
  shopping: { bg: '#9333ea', text: '#ffffff', iconEmoji: '🛍️' },
  restaurant: { bg: '#d97706', text: '#ffffff', iconEmoji: '🍽️' },
  park: { bg: '#059669', text: '#ffffff', iconEmoji: '🌳' },
  transit: { bg: '#4f46e5', text: '#ffffff', iconEmoji: '🚆' },
  culture: { bg: '#0891b2', text: '#ffffff', iconEmoji: '🏛️' }
};

/**
 * Computes dispersed coordinates so overlapping properties in the same building/block
 * are cleanly separated in a small circle, preventing overlapping pins.
 */
function computeDispersedCoordinates(properties: Property[]): Map<string, [number, number]> {
  const coordMap = new Map<string, [number, number]>();
  const clusters = new Map<string, Property[]>();

  // Group properties that share coordinates within ~200 meters
  properties.forEach((p) => {
    if (!p.latitude || !p.longitude) return;
    const clusterKey = `${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`;
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(p);
  });

  clusters.forEach((props) => {
    if (props.length === 1) {
      coordMap.set(props[0].id, [props[0].latitude!, props[0].longitude!]);
    } else {
      // Disperse multiple overlapping properties in an elegant offset ring
      const baseLat = props[0].latitude!;
      const baseLng = props[0].longitude!;
      const offsetRadius = 0.0025; // ~250 meters in lat/lng

      props.forEach((p, idx) => {
        const angle = (2 * Math.PI * idx) / props.length + Math.PI / 4;
        const lat = baseLat + offsetRadius * Math.sin(angle);
        const lng = baseLng + (offsetRadius * Math.cos(angle)) / Math.cos((baseLat * Math.PI) / 180);
        coordMap.set(p.id, [lat, lng]);
      });
    }
  });

  return coordMap;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onPropertySelect,
  onPropertyHover,
  onCityFocus,
  landmarks = [],
  showLandmarks = false,
  selectedLandmarkCategory = 'all',
  focusProperty,
  radiusKm,
  height = '100%',
  className = '',
  zoom = 12,
  center = [43.695, -79.395], // Default Toronto
  interactive = true,
  showControls = true,
  showCityQuickJump = true
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const propertyMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const landmarkMarkersRef = useRef<L.Marker[]>([]);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  
  // Track property dataset signature to only fly/fit when dataset actually changes (not on every hover/selection)
  const lastPropertiesKeyRef = useRef<string>('');

  const [activeTileStyle, setActiveTileStyle] = useState<'voyager' | 'dark' | 'osm'>('voyager');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [activeCityFilter, setActiveCityFilter] = useState<string | null>(null);

  const navigate = useNavigate();

  // Compute non-overlapping dispersed positions
  const propertyPositions = useMemo(() => {
    return computeDispersedCoordinates(properties);
  }, [properties]);

  // Determine distinct cities present in current properties
  const availableCities = useMemo(() => {
    const citySet = new Set(properties.map((p) => p.city.toLowerCase()));
    return Object.keys(CITY_CENTERS).filter((c) => citySet.has(c));
  }, [properties]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter = focusProperty && focusProperty.latitude && focusProperty.longitude
      ? [focusProperty.latitude, focusProperty.longitude] as [number, number]
      : properties.length > 0 && properties[0].latitude && properties[0].longitude
      ? [properties[0].latitude, properties[0].longitude] as [number, number]
      : center;

    const initialZoom = focusProperty ? 14 : zoom;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false, // We use luxury custom controls
      attributionControl: true,
      dragging: interactive,
      scrollWheelZoom: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive
    });

    const tileConfig = TILE_PROVIDERS[activeTileStyle];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConfig = TILE_PROVIDERS[activeTileStyle];
    tileLayerRef.current.setUrl(tileConfig.url);
  }, [activeTileStyle]);

  // Create Property Marker Element
  const createPropertyMarkerIcon = useCallback(
    (property: Property, isActive: boolean, isHovered: boolean) => {
      const priceFormatted = `$${property.price.toLocaleString()}`;
      const bedLabel = property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`;

      const html = `
        <div class="custom-property-pin ${isActive ? 'is-active' : ''} ${isHovered ? 'scale-115' : ''} group relative cursor-pointer select-none">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xl transition-all duration-300 ${
            isActive
              ? 'bg-primary text-accent border-accent ring-4 ring-accent/30 font-extrabold pulse-gold scale-105 shadow-2xl z-50'
              : isHovered
              ? 'bg-primary text-white border-accent scale-110 shadow-2xl z-40'
              : 'bg-primary/95 text-white border-white/40 hover:border-accent hover:bg-primary'
          }">
            <span class="inline-block w-2 h-2 rounded-full ${isActive ? 'bg-accent animate-ping' : 'bg-accent'}"></span>
            <span class="font-poppins font-bold text-xs tracking-tight">${priceFormatted}</span>
            <span class="text-[9px] opacity-80 border-l border-white/20 pl-1 font-medium hidden sm:inline-block">${bedLabel}</span>
          </div>
          <!-- Pointer arrow -->
          <div class="w-2.5 h-2.5 bg-primary border-r border-b ${
            isActive ? 'border-accent' : 'border-white/30'
          } rotate-45 mx-auto -mt-1 shadow-md"></div>
        </div>
      `;

      return L.divIcon({
        className: `custom-leaflet-pin pin-${property.id}`,
        html,
        iconSize: [110, 36],
        iconAnchor: [55, 36],
        popupAnchor: [0, -38]
      });
    },
    []
  );

  // Create Property Popup Content
  const createPopupContent = useCallback((property: Property) => {
    const bedsText = property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Beds`;
    const bathsText = `${property.bathrooms} Baths`;
    const sqftText = `${property.sqft} sq ft`;

    const container = document.createElement('div');
    container.className = 'w-72 overflow-hidden bg-white text-slate-800 rounded-2xl';

    container.innerHTML = `
      <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src="${property.image}" 
          alt="${property.title}" 
          class="w-full h-full object-cover"
        />
        <div class="absolute top-2 left-2 rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary shadow-sm font-poppins">
          ${property.type}
        </div>
        <div class="absolute bottom-2 right-2 rounded-xl bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-white text-[11px] font-bold font-poppins">
          CAD $${property.price.toLocaleString()} <span class="text-[9px] font-normal text-slate-300">/mo</span>
        </div>
      </div>
      <div class="p-3.5 space-y-2">
        <div>
          <h4 class="font-poppins font-bold text-xs text-primary leading-tight hover:text-accent transition-colors">
            ${property.title}
          </h4>
          <p class="text-[10px] text-slate-500 font-light flex items-center gap-1 mt-0.5">
            <span class="text-accent">📍</span> ${property.address || property.location}
          </p>
        </div>
        
        <div class="grid grid-cols-3 gap-1 py-1.5 border-y border-slate-100 text-[10px] font-semibold text-slate-600 text-center">
          <div>${bedsText}</div>
          <div class="border-x border-slate-100">${bathsText}</div>
          <div>${sqftText}</div>
        </div>

        <button 
          id="popup-details-btn-${property.id}"
          class="w-full text-center rounded-xl bg-primary text-white hover:bg-accent hover:text-primary py-2 text-[11px] font-bold font-poppins shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>View Residence Details</span>
          <span>→</span>
        </button>
      </div>
    `;

    setTimeout(() => {
      const btn = container.querySelector(`#popup-details-btn-${property.id}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(`/property/${property.id}`);
        });
      }
    }, 50);

    return container;
  }, [navigate]);

  // Update Markers and Handle Intelligent Camera Motion
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const existingMarkers = propertyMarkersRef.current;
    const currentPropertyIds = new Set(properties.map((p) => p.id));

    // Remove deleted markers
    existingMarkers.forEach((marker, id) => {
      if (!currentPropertyIds.has(id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Generate signature of current property IDs to avoid triggering camera resets on simple card hovers
    const propertiesKey = properties.map((p) => p.id).sort().join(',');
    const hasPropertiesChanged = propertiesKey !== lastPropertiesKeyRef.current;
    lastPropertiesKeyRef.current = propertiesKey;

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    properties.forEach((property) => {
      const pos = propertyPositions.get(property.id);
      if (!pos) return;

      bounds.extend(pos);

      const isActive = selectedPropertyId === property.id;
      const isHovered = hoveredPropertyId === property.id;
      const icon = createPropertyMarkerIcon(property, isActive, isHovered);

      let marker = existingMarkers.get(property.id);

      if (!marker) {
        marker = L.marker(pos, { 
          icon, 
          zIndexOffset: isActive ? 10000 : isHovered ? 5000 : 100 
        });
        
        marker.on('click', () => {
          if (onPropertySelect) onPropertySelect(property);
          map.panTo(pos, { animate: true, duration: 0.4 });
        });

        marker.on('mouseover', () => {
          if (onPropertyHover) onPropertyHover(property.id);
        });

        marker.on('mouseout', () => {
          if (onPropertyHover) onPropertyHover(null);
        });

        const popup = L.popup({
          maxWidth: 320,
          minWidth: 260,
          className: 'luxury-map-popup'
        }).setContent(createPopupContent(property));

        marker.bindPopup(popup);
        marker.addTo(map);
        existingMarkers.set(property.id, marker);
      } else {
        marker.setLatLng(pos);
        marker.setIcon(icon);
        marker.setZIndexOffset(isActive ? 10000 : isHovered ? 5000 : 100);
      }

      // If active, open popup and pan smoothly without resetting zoom level
      if (isActive) {
        if (!marker.isPopupOpen()) marker.openPopup();
      }
    });

    // Intelligent Camera Navigation: Only auto-adjust camera when the filtered properties list changes
    if (!focusProperty && hasPropertiesChanged && bounds.isValid() && properties.length > 0) {
      const distinctCities = Array.from(new Set(properties.map((p) => p.city.toLowerCase())));

      if (distinctCities.length === 1 && CITY_CENTERS[distinctCities[0]]) {
        // Single city filtered: Fly directly into that city with close-up luxury zoom
        const cityInfo = CITY_CENTERS[distinctCities[0]];
        map.flyTo(cityInfo.center, cityInfo.zoom, { animate: true, duration: 0.8 });
        setActiveCityFilter(distinctCities[0]);
      } else if (distinctCities.length > 1) {
        // Multiple cities across Canada: Focus on Toronto or first property's city at comfortable zoom
        // instead of zooming out into outer space
        const firstCity = distinctCities[0];
        const cityInfo = CITY_CENTERS[firstCity] || CITY_CENTERS.toronto;
        map.flyTo(cityInfo.center, cityInfo.zoom, { animate: true, duration: 0.8 });
        setActiveCityFilter(null);
      }
    }
  }, [
    properties,
    propertyPositions,
    selectedPropertyId,
    hoveredPropertyId,
    createPropertyMarkerIcon,
    createPopupContent,
    onPropertySelect,
    onPropertyHover,
    focusProperty
  ]);

  // Update Focus Property & Radius Circle (for Property Details page)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusProperty && focusProperty.latitude && focusProperty.longitude) {
      const centerCoord: [number, number] = [focusProperty.latitude, focusProperty.longitude];
      
      map.flyTo(centerCoord, 14, {
        animate: true,
        duration: 0.8
      });

      // Draw radius circle
      if (radiusKm && radiusKm > 0) {
        if (radiusCircleRef.current) {
          radiusCircleRef.current.remove();
        }

        const circle = L.circle(centerCoord, {
          radius: radiusKm * 1000,
          color: '#C5A35C',
          fillColor: '#C5A35C',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 8'
        }).addTo(map);

        radiusCircleRef.current = circle;
      }
    } else {
      if (radiusCircleRef.current) {
        radiusCircleRef.current.remove();
        radiusCircleRef.current = null;
      }
    }
  }, [focusProperty, radiusKm]);

  // Update Landmark Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    landmarkMarkersRef.current.forEach((m) => m.remove());
    landmarkMarkersRef.current = [];

    if (!showLandmarks || landmarks.length === 0) return;

    const filtered = landmarks.filter((lm) => {
      if (selectedLandmarkCategory === 'all') return true;
      return lm.category === selectedLandmarkCategory;
    });

    filtered.forEach((landmark) => {
      const colorMeta = LANDMARK_CATEGORY_COLORS[landmark.category] || {
        bg: '#0891b2',
        text: '#ffffff',
        iconEmoji: '📍'
      };

      const landmarkHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer select-none">
          <div class="h-7 w-7 rounded-full shadow-lg flex items-center justify-center text-xs border-2 border-white transition-transform duration-200 group-hover:scale-125" style="background-color: ${colorMeta.bg}; color: ${colorMeta.text}">
            <span>${colorMeta.iconEmoji}</span>
          </div>
          <div class="absolute -bottom-1 w-1.5 h-1.5 bg-slate-900 rotate-45"></div>
        </div>
      `;

      const landmarkIcon = L.divIcon({
        className: 'landmark-pin',
        html: landmarkHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const popupContent = `
        <div class="p-3 bg-white text-slate-800 rounded-xl space-y-1.5 max-w-xs">
          <div class="flex items-center gap-2">
            <span class="text-sm">${colorMeta.iconEmoji}</span>
            <h5 class="font-poppins font-bold text-xs text-primary leading-tight">${landmark.name}</h5>
          </div>
          <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style="background-color: ${colorMeta.bg}">
            ${landmark.category}
          </span>
          ${landmark.description ? `<p class="text-[11px] text-slate-500 font-light leading-relaxed">${landmark.description}</p>` : ''}
          ${landmark.address ? `<p class="text-[10px] text-slate-400 font-light">📍 ${landmark.address}</p>` : ''}
          <div class="flex items-center gap-2 pt-1 border-t border-slate-100 text-[10px] font-bold text-slate-600">
            ${landmark.distance ? `<span>📏 ${landmark.distance}</span>` : ''}
            ${landmark.walkTime ? `<span class="text-emerald-600">🚶 ${landmark.walkTime}</span>` : ''}
          </div>
        </div>
      `;

      const marker = L.marker([landmark.latitude, landmark.longitude], {
        icon: landmarkIcon,
        zIndexOffset: 50
      }).bindPopup(popupContent);

      marker.addTo(map);
      landmarkMarkersRef.current.push(marker);
    });
  }, [landmarks, showLandmarks, selectedLandmarkCategory]);

  // Jump camera directly to a specific city
  const handleCityJump = (cityKey: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (cityKey === 'all') {
      setActiveCityFilter(null);
      // Fit to all current property positions
      const bounds = L.latLngBounds([]);
      propertyPositions.forEach((pos) => bounds.extend(pos));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
      }
      return;
    }

    const cityInfo = CITY_CENTERS[cityKey];
    if (cityInfo) {
      setActiveCityFilter(cityKey);
      map.flyTo(cityInfo.center, cityInfo.zoom, { animate: true, duration: 0.8 });
      if (onCityFocus) onCityFocus(cityKey);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusProperty && focusProperty.latitude && focusProperty.longitude) {
      map.flyTo([focusProperty.latitude, focusProperty.longitude], 14);
      return;
    }

    if (activeCityFilter && CITY_CENTERS[activeCityFilter]) {
      const cityInfo = CITY_CENTERS[activeCityFilter];
      map.flyTo(cityInfo.center, cityInfo.zoom);
      return;
    }

    const bounds = L.latLngBounds([]);
    propertyPositions.forEach((pos) => bounds.extend(pos));

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-premium transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl bg-white' : ''
      } ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating City Quick Jump Bar */}
      {showCityQuickJump && availableCities.length > 1 && !focusProperty && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-lg overflow-x-auto max-w-[calc(100%-6rem)] no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1 shrink-0">
            <MapIcon className="h-3.5 w-3.5 text-accent" /> Jump To:
          </span>
          <button
            onClick={() => handleCityJump('all')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-poppins font-bold transition-all shrink-0 cursor-pointer ${
              activeCityFilter === null
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Cities
          </button>
          {availableCities.map((cityKey) => (
            <button
              key={cityKey}
              onClick={() => handleCityJump(cityKey)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-poppins font-bold transition-all shrink-0 cursor-pointer ${
                activeCityFilter === cityKey
                  ? 'bg-accent text-primary shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {CITY_CENTERS[cityKey]?.name || cityKey}
            </button>
          ))}
        </div>
      )}

      {/* Floating Map Custom Controls (Top Right) */}
      {showControls && (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {/* Zoom In / Out Group */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-lg p-1 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary active:scale-95 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
            <div className="h-px w-full bg-slate-100" />
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary active:scale-95 transition-colors cursor-pointer"
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Reset / Recenter Focus */}
          <button
            onClick={handleRecenter}
            title="Recenter Map"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg text-slate-600 hover:text-accent hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Map Layer Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              title="Change Map Theme"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg text-slate-600 hover:text-accent hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <Layers className="h-4 w-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-12 w-36 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 z-40">
                {(['voyager', 'dark', 'osm'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setActiveTileStyle(style);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-poppins font-medium transition-colors cursor-pointer ${
                      activeTileStyle === style
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {TILE_PROVIDERS[style].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Expand */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg text-slate-600 hover:text-primary hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Bottom Floating Map Navigation & Count Pill */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 pointer-events-none flex-wrap">
        <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 shadow-md flex items-center gap-2 text-xs font-semibold text-white font-poppins pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>
            {properties.length} {properties.length === 1 ? 'Residence' : 'Residences'} Shown
          </span>
        </div>

        {/* Helpful Tip */}
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-[11px] text-slate-600 font-medium hidden md:flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-accent" />
          <span>Click any pin to preview • Drag & scroll to explore</span>
        </div>
      </div>
    </div>
  );
}
