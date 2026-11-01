import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, BedDouble, DollarSign } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (price) params.append('price', price);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 -mt-16 relative z-30">
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6 md:p-8 lg:py-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end"
      >
        {/* Location Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-accent" /> City
          </label>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer appearance-none"
          >
            <option value="">Select City</option>
            <option value="toronto">Toronto</option>
            <option value="vancouver">Vancouver</option>
            <option value="montreal">Montreal</option>
            <option value="calgary">Calgary</option>
            <option value="ottawa">Ottawa</option>
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Home className="h-4 w-4 text-accent" /> Property Type
          </label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer appearance-none"
          >
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        {/* Bedrooms Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-accent" /> Bedrooms
          </label>
          <select 
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer appearance-none"
          >
            <option value="">Any Bedrooms</option>
            <option value="0">Studio</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>

        {/* Budget Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-accent" /> Max Budget (CAD)
          </label>
          <select 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer appearance-none"
          >
            <option value="">Any Budget</option>
            <option value="2000">Up to $2,000 CAD</option>
            <option value="2500">Up to $2,500 CAD</option>
            <option value="3000">Up to $3,000 CAD</option>
            <option value="3500">Up to $3,500 CAD</option>
            <option value="5000">Up to $5,000 CAD</option>
          </select>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-white hover:bg-accent hover:text-primary py-3.5 px-6 font-poppins font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Search className="h-4 w-4" /> Find Apartments
          </button>
        </div>
      </form>
    </div>
  );
}
