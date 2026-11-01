import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Heart, Calendar, Clock, MapPin, 
  LogOut, CheckCircle2, Trash2, 
  Search, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProperties } from '../utils/db';
import { getInquiries, addInquiry } from '../utils/authStorage';
import type { Property } from '../types/property';
import type { Inquiry } from '../types/auth';

export default function BuyerDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'favorites' | 'viewings' | 'profile'>('favorites');
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([]);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // New Viewing Modal State
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('morning');
  const [viewingNotes, setViewingNotes] = useState('');
  const [viewingSuccess, setViewingSuccess] = useState(false);

  const allProperties = getProperties();

  // Load favorites & inquiries
  const loadData = () => {
    const favoriteIds: string[] = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
    const favs = allProperties.filter((p) => favoriteIds.includes(p.id));
    setFavoriteProperties(favs);

    const inqs = getInquiries().filter(
      (i) => (user?.id && i.userId === user.id) || (user?.email && i.email.toLowerCase() === user.email.toLowerCase())
    );
    setUserInquiries(inqs);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRemoveFavorite = (propertyId: string) => {
    const favoriteIds: string[] = JSON.parse(localStorage.getItem('elite_estate_favorites') || '[]');
    const updated = favoriteIds.filter((id) => id !== propertyId);
    localStorage.setItem('elite_estate_favorites', JSON.stringify(updated));
    loadData();
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({ name, phone, bio });
    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) return;

    const prop = allProperties.find((p) => p.id === selectedPropertyId);
    if (!prop) return;

    addInquiry({
      propertyId: prop.id,
      propertyTitle: prop.title,
      type: 'tour',
      name: user?.name || 'Valued Buyer',
      email: user?.email || '',
      phone: user?.phone || '',
      date: preferredDate,
      timeSlot: preferredTime,
      message: viewingNotes,
      status: 'pending',
      userId: user?.id
    });

    setViewingSuccess(true);
    setTimeout(() => {
      setViewingSuccess(false);
      setShowViewingModal(false);
      setSelectedPropertyId('');
      setPreferredDate('');
      setViewingNotes('');
      loadData();
      setActiveTab('viewings');
    }, 2000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  const confirmedCount = userInquiries.filter((i) => i.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-primary rounded-3xl p-6 sm:p-10 text-white shadow-premium relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-accent/15 via-accent/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'}
                alt={user?.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-accent/40 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified Client Account
                  </span>
                </div>
                <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight">
                  Welcome, {user?.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5 flex items-center gap-2">
                  <span>{user?.email}</span>
                  {user?.phone && <span>• {user?.phone}</span>}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowViewingModal(true)}
                className="rounded-full bg-accent text-primary px-5 py-2.5 font-poppins text-xs font-bold shadow-md hover:bg-accent-light transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule Tour
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-white/10 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-white/15 px-4 py-2.5 font-poppins text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block">Saved Properties</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-accent">
                {favoriteProperties.length}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block">Tour Appointments</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-white">
                {userInquiries.length}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block">Confirmed Viewings</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-emerald-400">
                {confirmedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'favorites' ? 'text-accent' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Residences ({favoriteProperties.length})
            </span>
            {activeTab === 'favorites' && (
              <motion.div
                layoutId="buyerTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('viewings')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'viewings' ? 'text-accent' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Viewings & Inquiries ({userInquiries.length})
            </span>
            {activeTab === 'viewings' && (
              <motion.div
                layoutId="buyerTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' ? 'text-accent' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account Settings
            </span>
            {activeTab === 'profile' && (
              <motion.div
                layoutId="buyerTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        </div>

        {/* Tab 1: Saved Favorites */}
        {activeTab === 'favorites' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {favoriteProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-6">
                <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="font-poppins text-lg font-bold text-primary">No Saved Residences Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Browse our portfolio of luxury apartments and click the heart icon on any residence to bookmark it here.
                </p>
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 font-poppins font-semibold text-xs hover:bg-accent hover:text-primary transition-all shadow-md"
                >
                  <Search className="h-3.5 w-3.5" />
                  Explore Luxury Listings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property) => (
                  <div
                    key={property.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 flex flex-col hover:shadow-premium-hover transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(property.id)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-poppins font-bold text-primary text-base mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                      <div className="text-base font-extrabold text-primary font-poppins mb-4">
                        CAD ${property.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex gap-2">
                        <Link
                          to={`/property/${property.id}`}
                          className="flex-1 text-center py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-poppins font-semibold text-xs transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedPropertyId(property.id);
                            setShowViewingModal(true);
                          }}
                          className="flex-1 text-center py-2.5 rounded-xl bg-primary text-white hover:bg-accent hover:text-primary font-poppins font-semibold text-xs transition-colors shadow-sm"
                        >
                          Book Tour
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: My Viewings & Inquiries */}
        {activeTab === 'viewings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {userInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-6">
                <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="font-poppins text-lg font-bold text-primary">No Scheduled Viewings Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  You have not submitted any tour requests yet. Schedule a private viewing for any residence in our portfolio.
                </p>
                <button
                  onClick={() => setShowViewingModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-6 py-3 font-poppins font-bold text-xs hover:bg-accent-light transition-all shadow-md"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule a Viewing Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userInquiries.map((inquiry) => {
                  const statusColors: Record<string, string> = {
                    new: 'bg-amber-50 text-amber-700 border-amber-200',
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    contacted: 'bg-sky-50 text-sky-700 border-sky-200',
                    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    completed: 'bg-blue-50 text-blue-700 border-blue-200',
                    cancelled: 'bg-slate-50 text-slate-600 border-slate-200'
                  };
                  const pillClass = statusColors[inquiry.status] || 'bg-slate-50 text-slate-600 border-slate-200';

                  return (
                    <div
                      key={inquiry.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${pillClass}`}
                          >
                            {inquiry.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">
                            Requested on {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-poppins text-base font-bold text-primary">
                          {inquiry.propertyTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          {inquiry.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-accent" /> Date: <strong>{inquiry.date}</strong>
                            </span>
                          )}
                          {inquiry.timeSlot && (
                            <span className="flex items-center gap-1 capitalize">
                              <Clock className="h-3.5 w-3.5 text-accent" /> Time Slot: <strong>{inquiry.timeSlot}</strong>
                            </span>
                          )}
                        </div>

                        {inquiry.message && (
                          <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
                            "{inquiry.message}"
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        <Link
                          to={`/property/${inquiry.propertyId}`}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-primary hover:text-white text-xs font-semibold transition-colors"
                        >
                          View Property
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Profile & Settings */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <h3 className="font-poppins text-lg font-bold text-primary mb-1">Account & Concierge Profile</h3>
            <p className="text-xs text-slate-500 mb-6">
              Update your personal preferences and contact details for private viewings.
            </p>

            {profileSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Profile changes successfully updated!
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Email (Account ID)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Buyer Bio & Residence Preferences</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Seeking high-floor suites in Yorkville with balcony & parking."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-primary text-white hover:bg-accent hover:text-primary px-6 py-3 font-poppins font-semibold text-xs shadow-md transition-all duration-300"
              >
                Save Profile Changes
              </button>
            </form>
          </motion.div>
        )}

      </div>

      {/* Schedule Tour Modal */}
      <AnimatePresence>
        {showViewingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
            >
              <div className="bg-primary px-6 py-5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-poppins text-lg font-bold">Schedule Private Viewing</h3>
                  <p className="text-xs text-slate-300">Choose a luxury suite and preferred slot</p>
                </div>
                <button
                  onClick={() => setShowViewingModal(false)}
                  className="text-slate-300 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {viewingSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="font-poppins text-lg font-bold text-primary">Tour Appointment Requested!</h4>
                    <p className="text-xs text-slate-500">
                      Your viewing appointment has been added to your dashboard under review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Select Residence
                      </label>
                      <select
                        required
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="">Choose a property...</option>
                        {allProperties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} (${p.price.toLocaleString()}/mo - {p.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Time Slot
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 7 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Special Requests / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={viewingNotes}
                        onChange={(e) => setViewingNotes(e.target.value)}
                        placeholder="e.g. Require parking access during viewing."
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary text-white hover:bg-accent hover:text-primary py-3 font-poppins font-semibold text-xs shadow-md transition-all mt-2"
                    >
                      Confirm Schedule Request
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
