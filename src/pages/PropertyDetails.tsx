import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BedDouble, Bath, Maximize2, MapPin, Heart, Shield, ArrowLeft, 
  CheckCircle2, Calendar, Mail, Phone, Clock, LayoutGrid,
  ShieldCheck, Compass, Sparkles, Map
} from 'lucide-react';
import { getProperties, getPublicProperties } from '../utils/db';
import { getNearbyLandmarksForProperty, getNearbyProperties } from '../data/landmarks';
import type { Property, LandmarkCategory } from '../types/property';
import type { User } from '../types/auth';

import { useAuth } from '../context/AuthContext';
import { addInquiry, findUserById } from '../utils/authStorage';
import PropertyMap from '../components/map/PropertyMap';
import LandmarkCategoryChips from '../components/map/LandmarkCategoryChips';
import NearbyLandmarkList from '../components/map/NearbyLandmarkList';
import PropertyCard from '../components/PropertyCard';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [agentUser, setAgentUser] = useState<User | null>(null);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  
  // Landmark Discovery State
  const [selectedLandmarkCategory, setSelectedLandmarkCategory] = useState<LandmarkCategory | 'all'>('all');
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

  // State Management
  const [activePhoto, setActivePhoto] = useState('');
  const [activeFloorPlanIdx, setActiveFloorPlanIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'tour' | 'inquiry'>('tour');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  // Auto-fill logged-in user details if available
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Favorites & property tracking
  useEffect(() => {
    const list = getProperties();
    const publicList = getPublicProperties();
    const found = list.find((p) => p.id === id) || list[0];

    if (found) {
      setProperty(found);
      setActivePhoto(found.image);
      setActiveFloorPlanIdx(0);
      
      // Compute sister properties
      const nearby = getNearbyProperties(found, publicList, 3);
      setNearbyProperties(nearby);

      // Load agent details
      const agentId = found.agentId || 'user-agent-001';
      const storedAgent = findUserById(agentId);
      if (storedAgent) {
        setAgentUser(storedAgent);
      } else {
        setAgentUser({
          id: agentId,
          name: found.agentName || 'Victoria Vance',
          email: found.agentEmail || 'agent@eliteestate.com',
          phone: found.agentPhone || '+1 (416) 555-0199',
          role: 'agent',
          agencyName: found.agentAgency || 'Elite Sovereign Properties Ltd.',
          licenseNumber: 'RECO-ON-984210',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
          workingHours: 'Mon - Fri: 8:30 AM - 7:00 PM | Sat: 10:00 AM - 4:00 PM',
          availabilitySlots: ['Morning (9am - 12pm)', 'Afternoon (1pm - 5pm)', 'Weekends'],
          createdAt: '2025-11-10T14:20:00.000Z'
        });
      }

      const favorites = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
      setIsFavorite(favorites.includes(found.id));
    }
    setFormSubmitted(false);
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!property) return;
    const favorites = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
    let updatedFavorites: string[];

    if (isFavorite) {
      updatedFavorites = favorites.filter((favId: string) => favId !== property.id);
    } else {
      updatedFavorites = [...favorites, property.id];
    }

    localStorage.setItem('elite_estate_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    // Store inquiry persistently using addInquiry with agent attribution
    addInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.image,
      agentId: property.agentId || 'user-agent-001',
      type: activeTab, // 'tour' or 'inquiry'
      name,
      email,
      phone,
      date: activeTab === 'tour' ? date : undefined,
      message,
      status: 'new',
      userId: user?.id
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      if (!user) {
        setName('');
        setEmail('');
        setPhone('');
      }
      setDate('');
      setMessage('');
    }, 4000);
  };

  if (!property) {
    return (
      <div className="py-32 text-center text-slate-400 font-light">
        Retrieving property details...
      </div>
    );
  }

  // Fallback photos gallery if none defined
  const photosList = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const currentPlan = property.floorPlans && property.floorPlans.length > 0
    ? property.floorPlans[activeFloorPlanIdx]
    : null;

  // Nearby landmarks computed for this property
  const allNearbyLandmarks = getNearbyLandmarksForProperty(property, 'all');
  const filteredNearbyLandmarks = getNearbyLandmarksForProperty(property, selectedLandmarkCategory);

  // Landmark category counts
  const landmarkCounts: Partial<Record<LandmarkCategory | 'all', number>> = {
    all: allNearbyLandmarks.length,
    school: allNearbyLandmarks.filter(l => l.category === 'school').length,
    transit: allNearbyLandmarks.filter(l => l.category === 'transit').length,
    restaurant: allNearbyLandmarks.filter(l => l.category === 'restaurant').length,
    shopping: allNearbyLandmarks.filter(l => l.category === 'shopping').length,
    park: allNearbyLandmarks.filter(l => l.category === 'park').length,
    hospital: allNearbyLandmarks.filter(l => l.category === 'hospital').length,
    culture: allNearbyLandmarks.filter(l => l.category === 'culture').length
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <div>
        {/* Breadcrumbs / Back button */}
        <Link 
          to="/listings" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Listings Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ================= MAIN PROPERTY CONTENT: 8 cols ================= */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Title Section */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">Luxury Residence</span>
                <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-primary tracking-tight leading-snug">
                  {property.title}
                </h1>
                <p className="flex items-center gap-1.5 text-slate-500 mt-2.5 text-sm font-light">
                  <MapPin className="h-4 w-4 text-accent shrink-0" /> {property.address || property.location}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleFavoriteToggle}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-red-500 shadow-sm transition-all duration-300 cursor-pointer hover:border-slate-300"
                >
                  <Heart className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Interactive Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-100 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto}
                    src={activePhoto}
                    alt={property.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnail Navigation Row */}
              {photosList.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {photosList.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(photoUrl)}
                      className={`aspect-[4/3] rounded-xl overflow-hidden border bg-slate-100 transition-all duration-300 cursor-pointer ${
                        activePhoto === photoUrl 
                          ? 'border-accent ring-2 ring-accent/20 scale-95 shadow-sm' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:scale-98'
                      }`}
                    >
                      <img src={photoUrl} alt="Thumbnail view" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs Dashboard Grid */}
            <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-premium text-center font-semibold">
              <div className="flex flex-col items-center gap-1">
               <div className="flex items-center gap-1.5 text-primary text-base">
                 <BedDouble className="h-5 w-5 text-slate-400" />
                 <span>{property.bedrooms === 0 ? 'Studio' : property.bedrooms}</span>
               </div>
               <span className="text-[10px] uppercase text-slate-400 tracking-wider">Bedrooms</span>
             </div>
              <div className="flex flex-col items-center gap-1 border-x border-slate-100">
                <div className="flex items-center gap-1.5 text-primary text-base">
                  <Bath className="h-5 w-5 text-slate-400" />
                  <span>{property.bathrooms}</span>
                </div>
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-primary text-base">
                  <Maximize2 className="h-5 w-5 text-slate-400" />
                  <span>{property.sqft}</span>
                </div>
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Square Feet</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="font-poppins text-xl font-bold text-primary border-l-4 border-accent pl-3">
                About the Residence
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                {property.description || 'This stunning suite is designed to accommodate premium modern lifestyles, offering spacious living quarters, state-of-the-art finishes, and open structural plans. The floor-to-ceiling double-glazed windows flood the entire apartment with natural sunlight while isolating outdoor noise.'}
              </p>
            </div>

            {/* Premium Amenities Checklist */}
            <div className="space-y-4">
              <h3 className="font-poppins text-xl font-bold text-primary border-l-4 border-accent pl-3">
                Premium Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {property.amenities.map((amenity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 text-slate-600 bg-white border border-slate-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0" />
                    <span className="font-light">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= INTERACTIVE CSS BLUEPRINT FLOOR PLANS ================= */}
            {currentPlan && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-poppins text-xl font-bold text-primary border-l-4 border-accent pl-3 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-accent" /> Residential Layout Plan
                  </h3>
                  
                  {/* Plan Toggle Tabs */}
                  {property.floorPlans && property.floorPlans.length > 1 && (
                    <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl">
                      {property.floorPlans.map((plan, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveFloorPlanIdx(idx)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold font-poppins transition-all cursor-pointer ${
                            activeFloorPlanIdx === idx
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-slate-500 hover:text-primary'
                          }`}
                        >
                          {plan.name.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Styled CSS blueprint */}
                <div className="space-y-4">
                  <h4 className="font-poppins text-sm font-semibold text-primary">{currentPlan.name}</h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{currentPlan.description}</p>
                  
                  {/* Blueprint Drawing Box */}
                  <div 
                    className="border border-slate-800 rounded-3xl p-8 bg-slate-950 shadow-2xl relative overflow-hidden"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  >
                    <span className="absolute top-4 left-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      Interactive CAD Model
                    </span>
                    
                    {/* Grid Layout of Rooms */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {currentPlan.rooms.map((room, idx) => (
                        <div
                          key={idx}
                          className={`rounded-2xl border p-5 flex flex-col justify-between aspect-square group hover:scale-[1.03] hover:shadow-xl transition-all duration-300 ${room.color}`}
                        >
                          <div>
                            <h5 className="font-poppins text-xs font-bold transition-colors group-hover:text-primary">
                              {room.name}
                            </h5>
                            <span className="text-[10px] opacity-60 block mt-1">Room size</span>
                          </div>
                          <span className="font-poppins text-xs font-extrabold self-end tracking-wider">
                            {room.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= DETAILED LEASING COST TABLE ================= */}
            <div className="space-y-4">
              <h3 className="font-poppins text-xl font-bold text-primary border-l-4 border-accent pl-3">
                Leasing & Costs Breakdown
              </h3>
              <div className="bg-white border border-slate-100 shadow-premium rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Fee / Category</th>
                      <th className="px-6 py-4">Cost Structure</th>
                      <th className="px-6 py-4">Billing Cycle</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 font-light">
                    <tr className="border-b border-slate-50">
                      <td className="px-6 py-4 font-semibold text-primary">Monthly Rental</td>
                      <td className="px-6 py-4 font-semibold text-accent-dark font-poppins">CAD ${property.price.toLocaleString()}</td>
                      <td className="px-6 py-4">Monthly</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="px-6 py-4 font-semibold text-primary">Security Deposit</td>
                      <td className="px-6 py-4 font-poppins">CAD ${(property.deposit || property.price).toLocaleString()}</td>
                      <td className="px-6 py-4">One-time (refundable)</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="px-6 py-4 font-semibold text-primary">Leasing Application Fee</td>
                      <td className="px-6 py-4 font-poppins">CAD ${property.applicationFee || 50}</td>
                      <td className="px-6 py-4">One-time (non-refundable)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-primary">Utilities & Maintenance</td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-4 space-y-1">
                          {(property.utilities || ['Water, sewage, and gas included']).map((util, i) => (
                            <li key={i}>{util}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4">Variable / Included</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= NEIGHBORHOOD & NEARBY LANDMARKS MAP EXPLORATION ================= */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-poppins text-xl font-bold text-primary border-l-4 border-accent pl-3 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-accent" /> Location & Surrounding Neighborhood
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-1 pl-4">
                    Explore schools, transit connections, dining, shopping, and parks within the immediate vicinity.
                  </p>
                </div>
                <div className="pl-4 sm:pl-0 text-xs font-semibold text-accent-dark font-poppins">
                  📍 {property.address || property.location}
                </div>
              </div>

              {/* Landmark Category Filter Chips */}
              <LandmarkCategoryChips
                selectedCategory={selectedLandmarkCategory}
                onSelectCategory={setSelectedLandmarkCategory}
                landmarkCounts={landmarkCounts}
                size="md"
              />

              {/* Interactive Neighborhood Map */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent shadow-xs">
                    <Map className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-xs text-primary leading-tight">Property Location Map</h3>
                    <p className="text-[10px] text-slate-400 font-light">Interactive neighborhood coordinates</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-accent" />
                  {property.city}
                </span>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-premium">
                <PropertyMap
                  properties={[property]}
                  focusProperty={property}
                  radiusKm={2.5}
                  landmarks={filteredNearbyLandmarks}
                  showLandmarks={true}
                  selectedLandmarkCategory={selectedLandmarkCategory}
                  height={420}
                  className="rounded-3xl"
                />
              </div>

              {/* Nearest Landmarks Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-poppins font-bold text-primary">
                    Points of Interest Near {property.title} ({filteredNearbyLandmarks.length})
                  </span>
                  <span className="text-slate-400 font-light text-[11px]">
                    Walking & driving estimates
                  </span>
                </div>
                <NearbyLandmarkList
                  landmarks={filteredNearbyLandmarks}
                  selectedLandmarkId={selectedLandmarkId}
                  onLandmarkClick={(lm) => setSelectedLandmarkId(lm.id)}
                  maxItems={6}
                />
              </div>
            </div>

          </div>

          {/* ================= SIDEBAR LEASING FORM: 4 cols ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-100 shadow-premium rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Pricing Tag */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Rent</span>
                <div className="flex items-baseline mt-1 gap-1">
                  <span className="text-3xl font-extrabold text-primary font-poppins">
                    CAD ${property.price.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
              </div>

              {/* Listing Agent Presentation Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={agentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80'}
                    alt={agentUser?.name || 'Listing Agent'}
                    className="h-12 w-12 rounded-xl object-cover border border-accent/40 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-accent uppercase tracking-wider flex items-center gap-0.5">
                        <ShieldCheck className="h-2.5 w-2.5" /> Verified Agent
                      </span>
                    </div>
                    <h4 className="font-poppins font-bold text-xs text-primary truncate">
                      {agentUser?.name || property.agentName || 'Victoria Vance'}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {agentUser?.agencyName || property.agentAgency || 'Elite Sovereign Properties Ltd.'}
                    </p>
                  </div>
                </div>

                {agentUser?.workingHours && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <Clock className="h-3 w-3 text-accent shrink-0" />
                    <span className="truncate">{agentUser.workingHours}</span>
                  </div>
                )}

                {agentUser?.phone && (
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`tel:${agentUser.phone}`}
                      className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-accent hover:text-accent text-slate-700 text-center text-[11px] font-bold font-poppins transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="h-3 w-3 text-accent" /> Call
                    </a>
                    <a
                      href={`mailto:${agentUser.email}`}
                      className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-accent hover:text-accent text-slate-700 text-center text-[11px] font-bold font-poppins transition-colors flex items-center justify-center gap-1"
                    >
                      <Mail className="h-3 w-3 text-accent" /> Email
                    </a>
                  </div>
                )}
              </div>

              {/* Form Toggle Tabs */}
              <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setActiveTab('tour'); setFormSubmitted(false); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold font-poppins transition-all cursor-pointer ${
                    activeTab === 'tour'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  Schedule Tour
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('inquiry'); setFormSubmitted(false); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold font-poppins transition-all cursor-pointer ${
                    activeTab === 'inquiry'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  Send Inquiry
                </button>
              </div>

              {/* Interactive Form Panel */}
              <div className="border-t border-slate-100 pt-6">
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
                    >
                      <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                      <h4 className="font-bold text-primary text-sm">
                        {activeTab === 'tour' ? 'Tour Scheduled!' : 'Inquiry Submitted!'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-light">
                        {activeTab === 'tour' 
                          ? 'Our concierge team has received your calendar details and will call to confirm a private viewing time.' 
                          : 'Your residency request has been logged. A concierge representative will email you inside 24 hours.'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleFormSubmit} 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-accent" /> Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-accent" /> Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-accent" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 012-3456"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-accent"
                        />
                      </div>

                      {activeTab === 'tour' && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-accent" /> Preferred Date
                          </label>
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-accent cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-accent" /> Custom Message
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={activeTab === 'tour' ? 'Any specific details you would like us to prepare?' : 'Enter your specific questions...'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-accent resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-primary text-white hover:bg-accent hover:text-primary py-3 font-poppins font-bold text-xs shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {activeTab === 'tour' ? (
                          <>
                            <Calendar className="h-4 w-4" /> Book Viewing Tour
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" /> Send inquiry Message
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Quality Assurances */}
              <div className="border-t border-slate-100 pt-6 flex items-start gap-3 text-xs text-slate-400 leading-relaxed font-light">
                <Shield className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                <div>
                  Our verified listing guarantee secures you from arbitrary pricing hikes and ensures the property description represents structural conditions exactly.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= NEARBY SIMILAR RESIDENCES SECTION (Full Width) ================= */}
      {nearbyProperties.length > 0 && (
        <section className="pt-12 border-t border-slate-200/80 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Discovery Portfolio
              </span>
              <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                Nearby Luxury Residences
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
                Other premium apartments and condominium suites located in {property.neighborhood || property.city}.
              </p>
            </div>
            <Link
              to={`/listings?location=${encodeURIComponent(property.city.toLowerCase())}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold font-poppins text-primary hover:text-accent transition-colors"
            >
              View all in {property.city} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyProperties.map((nearbyProp) => (
              <PropertyCard key={nearbyProp.id} property={nearbyProp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
