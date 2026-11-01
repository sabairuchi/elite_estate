import React from 'react';
import { 
  GraduationCap, 
  Cross, 
  ShoppingBag, 
  Utensils, 
  Trees, 
  Train, 
  Building2,
  Footprints,
  Car,
  MapPin,
  Compass
} from 'lucide-react';
import type { Landmark, LandmarkCategory } from '../../types/property';

interface NearbyLandmarkListProps {
  landmarks: Landmark[];
  selectedLandmarkId?: string | null;
  onLandmarkClick?: (landmark: Landmark) => void;
  maxItems?: number;
  className?: string;
}

const CATEGORY_META: Record<LandmarkCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  school: {
    label: 'School',
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200'
  },
  hospital: {
    label: 'Healthcare',
    icon: <Cross className="h-3.5 w-3.5" />,
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200'
  },
  shopping: {
    label: 'Shopping',
    icon: <ShoppingBag className="h-3.5 w-3.5" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200'
  },
  restaurant: {
    label: 'Dining',
    icon: <Utensils className="h-3.5 w-3.5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200'
  },
  park: {
    label: 'Park',
    icon: <Trees className="h-3.5 w-3.5" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200'
  },
  transit: {
    label: 'Transit',
    icon: <Train className="h-3.5 w-3.5" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200'
  },
  culture: {
    label: 'Culture',
    icon: <Building2 className="h-3.5 w-3.5" />,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200'
  }
};

export default function NearbyLandmarkList({
  landmarks,
  selectedLandmarkId,
  onLandmarkClick,
  maxItems,
  className = ''
}: NearbyLandmarkListProps) {
  const displayItems = maxItems ? landmarks.slice(0, maxItems) : landmarks;

  if (landmarks.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-xs font-light">
        <Compass className="h-8 w-8 mx-auto text-slate-300 mb-2" />
        No landmarks found for this category in the immediate vicinity.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayItems.map((landmark) => {
        const meta = CATEGORY_META[landmark.category] || CATEGORY_META.culture;
        const isSelected = selectedLandmarkId === landmark.id;

        return (
          <div
            key={landmark.id}
            onClick={() => onLandmarkClick && onLandmarkClick(landmark)}
            className={`group bg-white rounded-2xl p-4 border transition-all duration-200 flex items-start justify-between gap-4 ${
              onLandmarkClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
            } ${
              isSelected ? 'border-accent ring-2 ring-accent/20 bg-accent/5' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              {/* Category Icon Badge */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${meta.bg} ${meta.color} shadow-xs group-hover:scale-105 transition-transform`}
              >
                {meta.icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-poppins font-bold text-xs text-primary group-hover:text-accent-dark transition-colors truncate">
                    {landmark.name}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${meta.bg} ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {landmark.description && (
                  <p className="text-[11px] text-slate-500 font-light mt-1 line-clamp-2 leading-relaxed">
                    {landmark.description}
                  </p>
                )}

                {landmark.address && (
                  <p className="text-[10px] text-slate-400 font-light mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-300 shrink-0" />
                    <span className="truncate">{landmark.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Travel Time & Distance Badges */}
            <div className="flex flex-col items-end shrink-0 gap-1 text-right">
              {landmark.distance && (
                <span className="font-poppins font-extrabold text-xs text-primary">
                  {landmark.distance}
                </span>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                {landmark.walkTime && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                    <Footprints className="h-3 w-3" /> {landmark.walkTime}
                  </span>
                )}
                {landmark.driveTime && (
                  <span className="inline-flex items-center gap-0.5 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md hidden sm:inline-flex">
                    <Car className="h-3 w-3" /> {landmark.driveTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
