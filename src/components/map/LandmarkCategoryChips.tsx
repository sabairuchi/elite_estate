import React from 'react';
import { 
  GraduationCap, 
  Cross, 
  ShoppingBag, 
  Utensils, 
  Trees, 
  Train, 
  Building2,
  Sparkles 
} from 'lucide-react';
import type { LandmarkCategory } from '../../types/property';

interface LandmarkCategoryChipsProps {
  selectedCategory: LandmarkCategory | 'all';
  onSelectCategory: (cat: LandmarkCategory | 'all') => void;
  landmarkCounts?: Partial<Record<LandmarkCategory | 'all', number>>;
  className?: string;
  size?: 'sm' | 'md';
}

interface CategoryOption {
  id: LandmarkCategory | 'all';
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}

const CATEGORIES: CategoryOption[] = [
  { 
    id: 'all', 
    label: 'All Landmarks', 
    icon: <Sparkles className="h-3.5 w-3.5" />,
    activeColor: 'bg-primary text-white border-primary shadow-sm'
  },
  { 
    id: 'school', 
    label: 'Schools', 
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    activeColor: 'bg-blue-600 text-white border-blue-600 shadow-sm'
  },
  { 
    id: 'transit', 
    label: 'Transit', 
    icon: <Train className="h-3.5 w-3.5" />,
    activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
  },
  { 
    id: 'restaurant', 
    label: 'Dining', 
    icon: <Utensils className="h-3.5 w-3.5" />,
    activeColor: 'bg-amber-600 text-white border-amber-600 shadow-sm'
  },
  { 
    id: 'shopping', 
    label: 'Shopping', 
    icon: <ShoppingBag className="h-3.5 w-3.5" />,
    activeColor: 'bg-purple-600 text-white border-purple-600 shadow-sm'
  },
  { 
    id: 'park', 
    label: 'Parks', 
    icon: <Trees className="h-3.5 w-3.5" />,
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
  },
  { 
    id: 'hospital', 
    label: 'Healthcare', 
    icon: <Cross className="h-3.5 w-3.5" />,
    activeColor: 'bg-rose-600 text-white border-rose-600 shadow-sm'
  },
  { 
    id: 'culture', 
    label: 'Culture', 
    icon: <Building2 className="h-3.5 w-3.5" />,
    activeColor: 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
  }
];

export default function LandmarkCategoryChips({
  selectedCategory,
  onSelectCategory,
  landmarkCounts,
  className = '',
  size = 'md'
}: LandmarkCategoryChipsProps) {
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar ${className}`}>
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = landmarkCounts?.[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl font-poppins font-medium transition-all duration-200 shrink-0 cursor-pointer ${
              isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs'
            } ${
              isSelected
                ? cat.activeColor
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
