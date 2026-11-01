import { Map, MapPin, ExternalLink, Navigation } from 'lucide-react';
import type { Property, Landmark, LandmarkCategory } from '../../types/property';

export interface PropertyMapProps {
  properties?: Property[];
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

export default function PropertyMap({
  properties = [],
  focusProperty,
  onCityFocus,
  landmarks = [],
  showLandmarks = false,
  height,
  className = '',
  showCityQuickJump = true
}: PropertyMapProps) {
  const targetProperty = focusProperty || (properties.length === 1 ? properties[0] : null);

  const locationQuery = targetProperty
    ? (targetProperty.address || targetProperty.location)
    : properties.length > 0
    ? `${properties[0].location || 'Canada'}`
    : 'Canada Luxury Real Estate';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;

  // Available cities from properties
  const cities = Array.from(new Set(properties.map((p) => p.location.split(',')[0].trim()))).filter(Boolean);

  return (
    <div
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height || '320px' }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 flex flex-col justify-between border border-slate-700/60 shadow-xl ${className}`}
    >
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A35C 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Header / Quick Jump */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 border border-accent/30 text-accent">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-accent">Map Location</span>
            <h4 className="text-sm font-bold font-poppins text-white leading-none">
              {targetProperty ? targetProperty.title : 'Geographic Coverage'}
            </h4>
          </div>
        </div>

        {showCityQuickJump && cities.length > 1 && onCityFocus && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-light flex items-center gap-1">
              <Navigation className="h-3 w-3 text-accent" /> Cities:
            </span>
            {cities.slice(0, 4).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onCityFocus(city)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/10 hover:bg-accent hover:text-slate-900 border border-white/10 transition-all cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center Icon & Coordinates / Location Info */}
      <div className="relative z-10 my-auto py-8 text-center space-y-4 max-w-md mx-auto">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-accent/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/90 border border-accent/40 shadow-2xl text-accent">
            <Map className="h-10 w-10" />
          </div>
        </div>

        <div>
          <h3 className="font-poppins text-xl font-bold text-white flex items-center justify-center gap-1.5">
            <MapPin className="h-5 w-5 text-accent shrink-0" />
            <span className="truncate">{locationQuery}</span>
          </h3>
          <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
            {targetProperty 
              ? `${targetProperty.neighborhood || targetProperty.location} • Verified Residence Location` 
              : `Showing ${properties.length} exclusive residences across prime Canadian locations`}
          </p>
        </div>

        {showLandmarks && landmarks.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{landmarks.length} Nearby Points of Interest documented</span>
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 font-light flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          <span>Interactive coordinates verified</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-slate-950 hover:bg-accent-light font-poppins font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <Map className="h-4 w-4" />
          <span>View on Google Maps</span>
          <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
        </a>
      </div>
    </div>
  );
}
