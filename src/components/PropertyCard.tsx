import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BedDouble, Bath, Maximize2, MapPin } from 'lucide-react';
import type { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
}

export default function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
    let updatedFavorites: string[];

    if (isFavorite) {
      updatedFavorites = favorites.filter((favId: string) => favId !== property.id);
    } else {
      updatedFavorites = [...favorites, property.id];
    }

    localStorage.setItem('elite_estate_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id, !isFavorite);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 border border-slate-100 flex flex-col h-full">
      {/* Property Image & Badge */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 shrink-0">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-500 shadow-md hover:bg-white transition-all duration-300 active:scale-95 cursor-pointer z-10"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'
            }`}
          />
        </button>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 font-poppins text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            Featured
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Pricing */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-poppins text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug">
            {property.title}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-xl font-extrabold text-primary font-poppins">
            CAD ${property.price.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-400"> / month</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-6">
          <MapPin className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Space Divider */}
        <div className="mt-auto">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 py-4 text-xs font-semibold text-slate-500">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-slate-700">
                <BedDouble className="h-4 w-4 text-slate-400" />
                <span>{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</span>
              </div>
              <span className="text-[10px] uppercase text-slate-400">Beds</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-slate-100">
              <div className="flex items-center gap-1 text-slate-700">
                <Bath className="h-4 w-4 text-slate-400" />
                <span>{property.bathrooms}</span>
              </div>
              <span className="text-[10px] uppercase text-slate-400">Baths</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-slate-700">
                <Maximize2 className="h-4 w-4 text-slate-400" />
                <span>{property.sqft}</span>
              </div>
              <span className="text-[10px] uppercase text-slate-400">Sq Ft</span>
            </div>
          </div>

          {/* Action CTA */}
          <Link
            to={`/property/${property.id}`}
            className="block w-full text-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:text-white py-3 font-poppins font-semibold text-sm text-primary transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
