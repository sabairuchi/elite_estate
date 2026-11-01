import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, Calendar, Mail, Trash2, Edit, Plus, X, 
  MapPin, ShieldCheck, Phone, LogOut, ExternalLink, Star,
  Search, CheckCircle2, LayoutGrid, List,
  MessageSquare, Clock, Briefcase,
  ChevronDown, Send, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getAgentProperties, 
  addProperty, 
  updateProperty, 
  deleteProperty, 
  updatePropertyStatus 
} from '../utils/db';
import { 
  getInquiries, 
  updateInquiryStatus, 
  addInquiryNote, 
  deleteInquiry 
} from '../utils/authStorage';
import type { Property, PropertyListingStatus } from '../types/property';
import type { Inquiry, InquiryStatus } from '../types/auth';

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

const AVAILABILITY_OPTIONS = [
  'Morning (9:00 AM - 12:00 PM)',
  'Afternoon (1:00 PM - 5:00 PM)',
  'Evening (5:00 PM - 8:00 PM)',
  'Weekends (Saturday & Sunday)'
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
];

export default function AgentDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries' | 'profile'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Filtering & View State for Properties
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState<'all' | PropertyListingStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtering State for Leads/Inquiries
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<'all' | 'tour' | 'inquiry'>('all');
  const [expandedInquiryNotes, setExpandedInquiryNotes] = useState<Record<string, boolean>>({});
  const [newNoteInputs, setNewNoteInputs] = useState<Record<string, string>>({});

  // Modal / Form state for Add/Edit Listing
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Delete Confirmation State
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<{ id: string; name: string } | null>(null);

  // Property Form Fields
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Toronto');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'Apartment' | 'Condo' | 'Penthouse' | 'Townhouse' | 'Villa'>('Apartment');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [sqft, setSqft] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(['', '']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [status, setStatus] = useState<PropertyListingStatus>('active');
  const [featured, setFeatured] = useState(false);
  const [deposit, setDeposit] = useState('');
  const [applicationFee, setApplicationFee] = useState('50');

  // Agent Profile State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profileAgency, setProfileAgency] = useState(user?.agencyName || '');
  const [profileLicense, setProfileLicense] = useState(user?.licenseNumber || '');
  const [profileAddress, setProfileAddress] = useState(user?.officeAddress || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileHours, setProfileHours] = useState(user?.workingHours || 'Mon - Fri: 8:30 AM - 7:00 PM | Sat: 10:00 AM - 4:00 PM');
  const [profileAvailability, setProfileAvailability] = useState<string[]>(
    user?.availabilitySlots || ['Morning (9:00 AM - 12:00 PM)', 'Afternoon (1:00 PM - 5:00 PM)', 'Weekends (Saturday & Sunday)']
  );
  const [profileContactMethod, setProfileContactMethod] = useState<'email' | 'phone' | 'whatsapp' | 'any'>(
    user?.preferredContactMethod || 'phone'
  );
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync user state to profile form
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone || '');
      setProfileAvatar(user.avatar || '');
      setProfileAgency(user.agencyName || '');
      setProfileLicense(user.licenseNumber || '');
      setProfileAddress(user.officeAddress || '');
      setProfileBio(user.bio || '');
      if (user.workingHours) setProfileHours(user.workingHours);
      if (user.availabilitySlots) setProfileAvailability(user.availabilitySlots);
      if (user.preferredContactMethod) setProfileContactMethod(user.preferredContactMethod);
    }
  }, [user]);

  // Load agent properties and inquiries
  const loadData = () => {
    if (user) {
      setProperties(getAgentProperties(user.id));
      setInquiries(getInquiries(user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [user, showFormModal]);

  // Open Form modal in Add mode
  const handleAddClick = () => {
    setEditingProperty(null);
    setTitle('');
    setCity('Toronto');
    setNeighborhood('');
    setAddress('');
    setPrice('');
    setType('Apartment');
    setBedrooms('2');
    setBathrooms('2');
    setSqft('');
    setDescription('');
    setMainImage('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
    setGalleryImages([
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
    ]);
    setSelectedAmenities(['Parking', 'Gym', 'Balcony', 'Elevator', 'Security']);
    setStatus('active');
    setFeatured(false);
    setDeposit('');
    setApplicationFee('50');
    setFormErrors({});
    setShowFormModal(true);
  };

  // Open Form modal in Edit mode
  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setTitle(property.title);
    setCity(property.city);
    setNeighborhood(property.neighborhood);
    setAddress(property.location);
    setPrice(property.price.toString());
    setType(property.type);
    setBedrooms(property.bedrooms.toString());
    setBathrooms(property.bathrooms.toString());
    setSqft(property.sqft.toString());
    setDescription(property.description || '');
    setMainImage(property.image);
    setGalleryImages(property.gallery && property.gallery.length > 1 ? property.gallery.slice(1) : ['', '']);
    setSelectedAmenities(property.amenities || []);
    setStatus(property.status || 'active');
    setFeatured(!!property.featured);
    setDeposit(property.deposit ? property.deposit.toString() : property.price.toString());
    setApplicationFee(property.applicationFee ? property.applicationFee.toString() : '50');
    setFormErrors({});
    setShowFormModal(true);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = 'Property title is required.';
    if (!neighborhood.trim()) errors.neighborhood = 'Neighborhood is required.';
    
    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Please enter a valid positive price.';
    }

    const parsedSqft = Number(sqft);
    if (!sqft || isNaN(parsedSqft) || parsedSqft <= 0) {
      errors.sqft = 'Please enter a valid square footage.';
    }

    if (!mainImage.trim()) {
      errors.mainImage = 'Main display image URL is required.';
    }

    if (!description.trim() || description.trim().length < 20) {
      errors.description = 'Please provide a descriptive overview (at least 20 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submit handler (Creates or updates property)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const rentPrice = Number(price);
    const parsedSqft = Number(sqft);
    const depositPrice = deposit ? Number(deposit) : rentPrice;
    const appFee = applicationFee ? Number(applicationFee) : 50;
    const cleanLocation = address.trim() || `${neighborhood.trim()}, ${city}`;

    // Filter valid gallery images
    const validGallery = [
      mainImage.trim(),
      ...galleryImages.map((img) => img.trim()).filter((img) => img.length > 0)
    ];

    const propertyPayload: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      city,
      neighborhood: neighborhood.trim(),
      location: cleanLocation,
      price: rentPrice,
      type,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: parsedSqft,
      featured,
      status,
      image: mainImage.trim(),
      gallery: validGallery,
      description: description.trim(),
      amenities: selectedAmenities,
      deposit: depositPrice,
      applicationFee: appFee,
      agentId: user?.id,
      agentName: user?.name,
      agentEmail: user?.email,
      agentPhone: user?.phone,
      agentAgency: user?.agencyName,
      utilities: ['Water & Sewage service included', 'Heating gas included', 'Power metered separately'],
      floorPlans: [
        {
          name: `${title.trim()} Master Suite Plan`,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          sqft: parsedSqft,
          rent: rentPrice,
          deposit: depositPrice,
          description: `Custom luxury architectural layout for ${title.trim()}.`,
          rooms: [
            { name: 'Primary Suite', size: "16' x 14'", color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700' },
            { name: 'Grand Living Space', size: "20' x 16'", color: 'bg-accent/10 border-accent/20 text-accent-dark' },
            { name: 'Chef Kitchen', size: "12' x 11'", color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700' }
          ]
        }
      ]
    };

    if (editingProperty) {
      // Edit Mode
      const res = updateProperty(editingProperty.id, propertyPayload, user?.id);
      if (res.success) {
        setFormSuccessMessage('Property listing updated successfully!');
      } else {
        alert(res.error || 'Failed to update property');
        return;
      }
    } else {
      // Add Mode
      addProperty(propertyPayload, user);
      setFormSuccessMessage('New luxury property listing published!');
    }

    setTimeout(() => {
      setFormSuccessMessage('');
      setShowFormModal(false);
      loadData();
    }, 1000);
  };

  // Toggle Featured status
  const handleToggleFeatured = (propertyId: string, currentFeatured: boolean) => {
    updateProperty(propertyId, { featured: !currentFeatured }, user?.id);
    loadData();
  };

  // Fast Status Change
  const handleStatusChange = (propertyId: string, newStatus: PropertyListingStatus) => {
    updatePropertyStatus(propertyId, newStatus, user?.id);
    loadData();
  };

  // Delete Property
  const handleConfirmDeleteProperty = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id, user?.id);
      setPropertyToDelete(null);
      loadData();
    }
  };

  // Amenity Checkbox Handler
  const handleAmenityCheck = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Gallery URL field change
  const handleGalleryChange = (index: number, val: string) => {
    const updated = [...galleryImages];
    updated[index] = val;
    setGalleryImages(updated);
  };

  const addGalleryField = () => {
    if (galleryImages.length < 6) {
      setGalleryImages([...galleryImages, '']);
    }
  };

  // Inquiry Lead Status Handler
  const handleInquiryStatusChange = (inquiryId: string, newStatus: InquiryStatus) => {
    updateInquiryStatus(inquiryId, newStatus, user?.id);
    loadData();
  };

  // Add Internal Agent Note
  const handleAddInquiryNote = (inquiryId: string) => {
    const noteText = newNoteInputs[inquiryId];
    if (!noteText || !noteText.trim()) return;

    addInquiryNote(inquiryId, noteText.trim(), user?.name || 'Agent', user?.id);
    setNewNoteInputs({ ...newNoteInputs, [inquiryId]: '' });
    loadData();
  };

  // Delete Inquiry
  const handleConfirmDeleteInquiry = () => {
    if (inquiryToDelete) {
      deleteInquiry(inquiryToDelete.id, user?.id);
      setInquiryToDelete(null);
      loadData();
    }
  };

  // Agent Profile Save Handler
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar.trim(),
      agencyName: profileAgency.trim(),
      licenseNumber: profileLicense.trim(),
      officeAddress: profileAddress.trim(),
      bio: profileBio.trim(),
      workingHours: profileHours.trim(),
      availabilitySlots: profileAvailability,
      preferredContactMethod: profileContactMethod
    });

    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } else {
      alert(res.error || 'Failed to update profile');
    }
  };

  const handleAvailabilityToggle = (slot: string) => {
    if (profileAvailability.includes(slot)) {
      setProfileAvailability(profileAvailability.filter((s) => s !== slot));
    } else {
      setProfileAvailability([...profileAvailability, slot]);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Filtered Properties
  const filteredProperties = properties.filter((p) => {
    if (propertyStatusFilter !== 'all' && (p.status || 'active') !== propertyStatusFilter) {
      return false;
    }
    if (propertySearch.trim()) {
      const q = propertySearch.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchLocation = p.location.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchNeighborhood = p.neighborhood.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchCity && !matchNeighborhood) {
        return false;
      }
    }
    return true;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter !== 'all') {
      if (inquiryStatusFilter === 'new' && (inq.status === 'new' || inq.status === 'pending')) {
        // match
      } else if (inq.status !== inquiryStatusFilter) {
        return false;
      }
    }
    if (inquiryTypeFilter !== 'all' && inq.type !== inquiryTypeFilter) {
      return false;
    }
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase();
      const matchName = inq.name.toLowerCase().includes(q);
      const matchEmail = inq.email.toLowerCase().includes(q);
      const matchPhone = inq.phone.toLowerCase().includes(q);
      const matchTitle = inq.propertyTitle.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchTitle) {
        return false;
      }
    }
    return true;
  });

  // Calculations for Metrics Strip
  const totalVolume = properties.reduce((acc, p) => acc + (p.status !== 'inactive' ? p.price : 0), 0);
  const activeCount = properties.filter((p) => (p.status || 'active') === 'active').length;
  const draftCount = properties.filter((p) => p.status === 'draft').length;
  const pendingLeadsCount = inquiries.filter((i) => i.status === 'new' || i.status === 'pending').length;
  const totalToursCount = inquiries.filter((i) => i.type === 'tour').length;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= AGENT HEADER BANNER ================= */}
        <div className="bg-primary rounded-3xl p-6 sm:p-10 text-white shadow-premium relative overflow-hidden mb-8 border border-white/5">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-accent/15 via-accent/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80'}
                  alt={user?.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-accent/60 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 h-4 w-4 rounded-full border-2 border-primary" title="Online & Active" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="bg-accent text-primary text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="h-3 w-3" /> Licensed Broker / Agent
                  </span>
                  {user?.licenseNumber && (
                    <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                      {user.licenseNumber}
                    </span>
                  )}
                </div>
                <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{user?.agencyName || 'Elite Sovereign Properties Ltd.'}</span>
                  <span>•</span>
                  <span>{user?.email}</span>
                  {user?.phone && (
                    <>
                      <span>•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddClick}
                className="rounded-full bg-accent text-primary px-5 py-2.5 font-poppins text-xs font-bold shadow-md hover:bg-accent-light transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-accent/20"
              >
                <Plus className="h-4 w-4" />
                Add New Listing
              </button>
              <Link
                to="/listings"
                target="_blank"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2.5 font-poppins text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Eye className="h-3.5 w-3.5 text-accent" />
                View Catalog
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-white/10 hover:bg-red-500/20 text-slate-200 hover:text-red-300 border border-white/15 px-4 py-2.5 font-poppins text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block font-semibold">Active Listings</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-white mt-0.5 block">
                {activeCount} <span className="text-xs font-normal text-emerald-400">Live</span>
              </span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block font-semibold">Drafts & Inactive</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-slate-300 mt-0.5 block">
                {draftCount} Drafts
              </span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block font-semibold">Monthly Volume</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-accent mt-0.5 block truncate">
                ${totalVolume.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block font-semibold">Pending Leads</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-amber-300 mt-0.5 block">
                {pendingLeadsCount} Leads
              </span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-slate-300 tracking-wider block font-semibold">Tours Booked</span>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-emerald-400 mt-0.5 block">
                {totalToursCount} Tours
              </span>
            </div>
          </div>
        </div>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'properties' ? 'text-accent font-bold' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Residences Hub</span>
            <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold">
              {properties.length}
            </span>
            {activeTab === 'properties' && (
              <motion.div layoutId="agentTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'inquiries' ? 'text-accent font-bold' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Leads & Inquiries</span>
            {pendingLeadsCount > 0 ? (
              <span className="h-5 px-2 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {pendingLeadsCount} New
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-0.5 font-bold">
                {inquiries.length}
              </span>
            )}
            {activeTab === 'inquiries' && (
              <motion.div layoutId="agentTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-6 font-poppins text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'profile' ? 'text-accent font-bold' : 'text-slate-500 hover:text-primary'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Profile & Availability</span>
            <span className="text-[10px] uppercase font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10">
              Verified
            </span>
            {activeTab === 'profile' && (
              <motion.div layoutId="agentTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent" />
            )}
          </button>
        </div>

        {/* ================= TAB 1: PROPERTY MANAGEMENT ================= */}
        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Search, Filter & View Mode Controls */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search listings by title, neighborhood, city..."
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
                {propertySearch && (
                  <button
                    onClick={() => setPropertySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Type filter pills */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status selector */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                  {(['all', 'active', 'draft', 'sold', 'rented', 'inactive'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setPropertyStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                        propertyStatusFilter === st
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-slate-600 hover:text-primary hover:bg-slate-200/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Table / List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
                <Building className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-poppins text-lg font-bold text-primary">No listings match your search</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Try clearing your search query or status filter, or create a brand new listing.
                </p>
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white hover:bg-accent hover:text-primary px-6 py-2.5 font-poppins text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create New Listing
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const currentStatus = property.status || 'active';
                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 flex flex-col group hover:shadow-premium-hover transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Status badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                              currentStatus === 'active'
                                ? 'bg-emerald-600 text-white'
                                : currentStatus === 'draft'
                                ? 'bg-amber-500 text-white'
                                : currentStatus === 'sold'
                                ? 'bg-purple-600 text-white'
                                : currentStatus === 'rented'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {currentStatus}
                          </span>

                          {property.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-accent text-primary flex items-center gap-1 shadow-sm w-fit">
                              <Star className="h-2.5 w-2.5 fill-primary" /> Featured
                            </span>
                          )}
                        </div>

                        {/* Top Right Action Quick Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(property.id, !!property.featured)}
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                              property.featured
                                ? 'bg-accent text-primary'
                                : 'bg-white/90 text-slate-500 hover:bg-accent hover:text-primary'
                            }`}
                            title="Toggle Homepage Feature"
                          >
                            <Star className={`h-3.5 w-3.5 ${property.featured ? 'fill-primary' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleEditClick(property)}
                            className="h-8 w-8 rounded-full bg-white/95 text-slate-700 hover:bg-accent hover:text-primary flex items-center justify-center shadow-md transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setPropertyToDelete({ id: property.id, title: property.title })}
                            className="h-8 w-8 rounded-full bg-white/95 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Gallery photos count pill */}
                        {property.gallery && property.gallery.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {property.gallery.length} Photos
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-poppins font-bold text-primary text-base leading-snug">
                            {property.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                          <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>

                        <div className="flex items-baseline justify-between mb-4">
                          <div className="text-base font-extrabold text-primary font-poppins">
                            CAD ${property.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ mo</span>
                          </div>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {property.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 py-3 text-xs text-slate-600 font-semibold mb-4">
                          <div className="text-center">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Beds`}</div>
                          <div className="text-center border-x border-slate-100">{property.bathrooms} Baths</div>
                          <div className="text-center">{property.sqft} sqft</div>
                        </div>

                        {/* Status Quick Switcher & Live Link */}
                        <div className="mt-auto pt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Status:</label>
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(property.id, e.target.value as PropertyListingStatus)}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 focus:border-accent focus:outline-none"
                            >
                              <option value="active">Active (Live)</option>
                              <option value="draft">Draft (Private)</option>
                              <option value="sold">Sold</option>
                              <option value="rented">Rented</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(property)}
                              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-poppins font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </button>
                            <Link
                              to={`/property/${property.id}`}
                              target="_blank"
                              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-primary hover:bg-accent hover:text-primary text-white font-poppins font-semibold text-xs transition-colors"
                            >
                              <span>View Live</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE / LIST VIEW */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Property</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Specs</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredProperties.map((property) => {
                        const currentStatus = property.status || 'active';
                        return (
                          <tr key={property.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="h-12 w-16 rounded-lg object-cover shrink-0 border border-slate-100"
                                />
                                <div>
                                  <span className="font-bold font-poppins text-primary block leading-tight">
                                    {property.title}
                                  </span>
                                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-accent" /> {property.location}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">
                              {property.type}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-primary font-poppins">
                              ${property.price.toLocaleString()}/mo
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {property.bedrooms} Beds • {property.bathrooms} Baths • {property.sqft} sqft
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(property.id, e.target.value as PropertyListingStatus)}
                                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-2xs focus:border-accent focus:outline-none"
                              >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="sold">Sold</option>
                                <option value="rented">Rented</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/property/${property.id}`}
                                  target="_blank"
                                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                                  title="View on Website"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleEditClick(property)}
                                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-accent hover:text-primary text-slate-600 flex items-center justify-center transition-colors"
                                  title="Edit Listing"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setPropertyToDelete({ id: property.id, title: property.title })}
                                  className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-colors"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 2: LEADS & INQUIRIES ================= */}
        {activeTab === 'inquiries' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by buyer name, email, phone, or residence..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
                {inquirySearch && (
                  <button
                    onClick={() => setInquirySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Pipeline Status Filter */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
                  {(['all', 'new', 'contacted', 'in_progress', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setInquiryStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        inquiryStatusFilter === st
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-slate-600 hover:text-primary hover:bg-slate-200/60'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Inquiry Type Filter */}
                <select
                  value={inquiryTypeFilter}
                  onChange={(e) => setInquiryTypeFilter(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-accent focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="tour">VIP Tours</option>
                  <option value="inquiry">General Inquiries</option>
                </select>
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
                <Mail className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-poppins text-lg font-bold text-primary">No inquiries matching criteria</h3>
                <p className="text-xs text-slate-500 mt-1">All new tour bookings and property messages will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.map((inquiry) => {
                  const isNotesOpen = !!expandedInquiryNotes[inquiry.id];
                  const notesList = inquiry.notes || [];

                  return (
                    <div
                      key={inquiry.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col space-y-4 hover:border-accent/40 transition-colors"
                    >
                      {/* Top Row: Status, Type, Timestamp */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              inquiry.status === 'confirmed' || inquiry.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : inquiry.status === 'in_progress'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : inquiry.status === 'contacted'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : inquiry.status === 'new' || inquiry.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            Status: {inquiry.status.replace('_', ' ')}
                          </span>

                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold uppercase px-2.5 py-1 rounded-full">
                            {inquiry.type === 'tour' ? 'VIP Viewing Tour' : 'General Inquiry'}
                          </span>

                          <span className="text-xs text-slate-400">
                            Received {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Pipeline Status Action Dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update Stage:</label>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleInquiryStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-accent focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed / Closed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => setInquiryToDelete({ id: inquiry.id, name: inquiry.name })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete Lead Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Section: Lead Info + Property Linked */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left 8 cols: Buyer Info & Message */}
                        <div className="lg:col-span-8 space-y-3">
                          <div>
                            <h4 className="font-poppins text-lg font-bold text-primary flex items-center gap-2">
                              <span>{inquiry.name}</span>
                            </h4>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                              <a
                                href={`mailto:${inquiry.email}`}
                                className="flex items-center gap-1.5 bg-slate-50 hover:bg-accent/10 hover:text-accent px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
                              >
                                <Mail className="h-3.5 w-3.5 text-accent" /> {inquiry.email}
                              </a>

                              {inquiry.phone && (
                                <a
                                  href={`tel:${inquiry.phone}`}
                                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-accent/10 hover:text-accent px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
                                >
                                  <Phone className="h-3.5 w-3.5 text-accent" /> {inquiry.phone}
                                </a>
                              )}

                              {inquiry.date && (
                                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
                                  <Calendar className="h-3.5 w-3.5 text-amber-600" /> Tour: {inquiry.date} ({inquiry.timeSlot})
                                </span>
                              )}
                            </div>
                          </div>

                          {inquiry.message && (
                            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Buyer Message:</span>
                              <p className="italic">"{inquiry.message}"</p>
                            </div>
                          )}
                        </div>

                        {/* Right 4 cols: Associated Property Card Link */}
                        <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-3 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Inquired Residence</span>
                          <div className="flex items-center gap-3">
                            {inquiry.propertyImage && (
                              <img
                                src={inquiry.propertyImage}
                                alt={inquiry.propertyTitle}
                                className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-200"
                              />
                            )}
                            <div className="min-w-0">
                              <h5 className="font-poppins font-bold text-xs text-primary truncate">
                                {inquiry.propertyTitle}
                              </h5>
                              <Link
                                to={`/property/${inquiry.propertyId}`}
                                target="_blank"
                                className="text-[11px] text-accent hover:underline flex items-center gap-1 font-semibold mt-0.5"
                              >
                                <span>Live Property Page</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Internal Notes Accordion & Feed */}
                      <div className="border-t border-slate-100 pt-3">
                        <button
                          onClick={() => setExpandedInquiryNotes({ ...expandedInquiryNotes, [inquiry.id]: !isNotesOpen })}
                          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-accent transition-colors cursor-pointer"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-accent" />
                          <span>Internal Agent Notes ({notesList.length})</span>
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isNotesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isNotesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80"
                            >
                              {/* Historical notes */}
                              {notesList.length > 0 ? (
                                <div className="space-y-2">
                                  {notesList.map((note) => (
                                    <div key={note.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                                        <span className="font-bold text-primary">{note.authorName}</span>
                                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                                      </div>
                                      <p className="text-slate-700">{note.text}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">No internal agent notes logged yet.</p>
                              )}

                              {/* Add Note Form */}
                              <div className="flex gap-2 pt-2">
                                <input
                                  type="text"
                                  placeholder="Log phone call note, client preference, or private remark..."
                                  value={newNoteInputs[inquiry.id] || ''}
                                  onChange={(e) => setNewNoteInputs({ ...newNoteInputs, [inquiry.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddInquiryNote(inquiry.id);
                                    }
                                  }}
                                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddInquiryNote(inquiry.id)}
                                  className="px-4 py-2 bg-primary hover:bg-accent hover:text-primary text-white rounded-lg text-xs font-bold font-poppins transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Send className="h-3 w-3" /> Add Note
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 3: AGENT PROFILE & AVAILABILITY ================= */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left 7 cols: Edit Profile Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-poppins text-xl font-bold text-primary">Professional Profile & Availability</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your public credentials, agency branding, and tour booking schedule shown to prospective buyers.
                </p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Your agent profile and availability settings have been updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Avatar Photo URL & Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Profile Photo URL</label>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Or pick photo preset:</span>
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileAvatar(preset)}
                        className="h-7 w-7 rounded-full overflow-hidden border-2 border-transparent hover:border-accent transition-all cursor-pointer"
                      >
                        <img src={preset} alt="preset" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone & Agency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Direct Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+1 (416) 555-0199"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Brokerage / Agency Name</label>
                    <input
                      type="text"
                      value={profileAgency}
                      onChange={(e) => setProfileAgency(e.target.value)}
                      placeholder="Elite Sovereign Properties Ltd."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* License & Office Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Real Estate License #</label>
                    <input
                      type="text"
                      value={profileLicense}
                      onChange={(e) => setProfileLicense(e.target.value)}
                      placeholder="RECO-ON-984210"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Office Address</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="100 Sovereign Way, Suite 4800, Toronto, ON"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Professional Bio & Experience</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Describe your market specialties, luxury accolades, and client commitment..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Working Hours */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Working / Office Hours</label>
                  <input
                    type="text"
                    value={profileHours}
                    onChange={(e) => setProfileHours(e.target.value)}
                    placeholder="Mon - Fri: 8:30 AM - 7:00 PM | Sat: 10:00 AM - 4:00 PM"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Tour Availability Slots */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Available Tour Viewing Windows
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABILITY_OPTIONS.map((slot) => (
                      <label
                        key={slot}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={profileAvailability.includes(slot)}
                          onChange={() => handleAvailabilityToggle(slot)}
                          className="rounded border-slate-300 text-accent focus:ring-accent"
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Preferred Contact Method</label>
                  <select
                    value={profileContactMethod}
                    onChange={(e) => setProfileContactMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                  >
                    <option value="phone">Direct Phone Call / SMS</option>
                    <option value="email">Email Communications</option>
                    <option value="whatsapp">WhatsApp VIP Messenger</option>
                    <option value="any">Any Preferred Channel</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-primary text-white hover:bg-accent hover:text-primary text-xs font-bold font-poppins shadow-md transition-all cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Right 5 cols: Live Public Profile Card Preview */}
            <div className="lg:col-span-5 space-y-4 sticky top-28">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Public Buyer Preview</span>
                <span className="text-[10px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-full">
                  As shown on Property Pages
                </span>
              </div>

              {/* Public Agent Card Mockup */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium space-y-5">
                <div className="flex items-center gap-4">
                  <img
                    src={profileAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80'}
                    alt={profileName}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-accent/40 shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Listing Agent
                    </span>
                    <h4 className="font-poppins text-lg font-bold text-primary leading-tight mt-0.5">
                      {profileName || 'Victoria Vance'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {profileAgency || 'Elite Sovereign Properties Ltd.'}
                    </p>
                    {profileLicense && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        Lic: {profileLicense}
                      </span>
                    )}
                  </div>
                </div>

                {profileBio && (
                  <p className="text-xs text-slate-600 leading-relaxed font-light bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    "{profileBio}"
                  </p>
                )}

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>{profileHours}</span>
                  </div>
                  {profileAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{profileAddress}</span>
                    </div>
                  )}
                </div>

                {profileAvailability.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                      Tour Viewing Slots:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profileAvailability.map((slot, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {slot.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  {profilePhone && (
                    <a
                      href={`tel:${profilePhone}`}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white text-center text-xs font-bold font-poppins hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Agent
                    </a>
                  )}
                  <a
                    href={`mailto:${profileEmail}`}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center text-xs font-bold font-poppins transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ================= ADD / EDIT LISTING MODAL ================= */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 z-10 no-scrollbar"
            >
              <div className="bg-primary px-6 py-5 text-white flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div>
                  <h3 className="font-poppins text-lg font-bold">
                    {editingProperty ? 'Edit Luxury Residence' : 'Add New Luxury Residence'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Publish high-end residences to the Elite State live catalog
                  </p>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="rounded-full p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formSuccessMessage && (
                <div className="m-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                
                {/* 1. BASIC INFORMATION */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-primary border-b border-slate-100 pb-2">
                    1. Basic Property Information
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Sovereign Penthouse Suite"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                        formErrors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-accent'
                      }`}
                    />
                    {formErrors.title && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Property Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white focus:border-accent focus:outline-none"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Villa">Luxury Villa</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white focus:border-accent focus:outline-none"
                      >
                        <option value="Toronto">Toronto</option>
                        <option value="Vancouver">Vancouver</option>
                        <option value="Montreal">Montreal</option>
                        <option value="Calgary">Calgary</option>
                        <option value="Ottawa">Ottawa</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Neighborhood *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yorkville / Waterfront"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                          formErrors.neighborhood ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-accent'
                        }`}
                      />
                      {formErrors.neighborhood && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.neighborhood}</p>}
                    </div>
                  </div>
                </div>

                {/* 2. PRICING & SPECIFICATIONS */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-primary border-b border-slate-100 pb-2">
                    2. Pricing & Structural Specifications
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Rent Price ($/mo) *
                      </label>
                      <input
                        type="number"
                        required
                        min={100}
                        placeholder="3500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                          formErrors.price ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-accent'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Bedrooms</label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white focus:border-accent focus:outline-none"
                      >
                        <option value="0">Studio</option>
                        <option value="1">1 Bed</option>
                        <option value="2">2 Beds</option>
                        <option value="3">3 Beds</option>
                        <option value="4">4+ Beds</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Bathrooms</label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-white focus:border-accent focus:outline-none"
                      >
                        <option value="1">1 Bath</option>
                        <option value="1.5">1.5 Baths</option>
                        <option value="2">2 Baths</option>
                        <option value="2.5">2.5 Baths</option>
                        <option value="3">3 Baths</option>
                        <option value="4">4+ Baths</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Square Feet *
                      </label>
                      <input
                        type="number"
                        required
                        min={100}
                        placeholder="1250"
                        value={sqft}
                        onChange={(e) => setSqft(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                          formErrors.sqft ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-accent'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. MEDIA & GALLERY */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-primary border-b border-slate-100 pb-2">
                    3. Imagery & Media Gallery
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Main Featured Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>

                  {mainImage && (
                    <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={mainImage} alt="Main Preview" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Additional Gallery Photos
                      </label>
                      <button
                        type="button"
                        onClick={addGalleryField}
                        className="text-xs text-accent font-bold hover:underline"
                      >
                        + Add Photo URL
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {galleryImages.map((imgUrl, idx) => (
                        <input
                          key={idx}
                          type="url"
                          placeholder={`Gallery Photo ${idx + 1} URL`}
                          value={imgUrl}
                          onChange={(e) => handleGalleryChange(idx, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-accent focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. AMENITIES & DESCRIPTION */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-primary border-b border-slate-100 pb-2">
                    4. Amenities & Property Description
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Amenities Included
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_AMENITIES.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityCheck(amenity)}
                            className="rounded border-slate-300 text-accent focus:ring-accent"
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Property Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Provide a compelling overview of this luxury residence..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                        formErrors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-accent'
                      }`}
                    />
                    {formErrors.description && <p className="text-[10px] text-red-500 mt-0.5">{formErrors.description}</p>}
                  </div>
                </div>

                {/* 5. PUBLISHING STATUS & FEATURED */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-bold text-sm text-primary border-b border-slate-100 pb-2">
                    5. Listing Status & Options
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Listing Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as PropertyListingStatus)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-accent focus:outline-none"
                      >
                        <option value="active">Active (Visible to Buyers)</option>
                        <option value="draft">Draft (Private to Agent)</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="featuredListingModal"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded border-slate-300 text-accent focus:ring-accent h-4 w-4"
                      />
                      <label htmlFor="featuredListingModal" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Feature on Homepage Hero Showcase
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl bg-primary text-white hover:bg-accent hover:text-primary text-xs font-bold font-poppins shadow-md transition-all cursor-pointer"
                  >
                    {editingProperty ? 'Save Listing Changes' : 'Publish Listing'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= DELETE PROPERTY CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {propertyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPropertyToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 z-10 text-center space-y-4"
            >
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h4 className="font-poppins text-lg font-bold text-primary">Delete Residence Listing?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently remove <strong className="text-slate-800 font-semibold">"{propertyToDelete.title}"</strong> from the website catalog?
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setPropertyToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteProperty}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold font-poppins hover:bg-red-700 shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= DELETE INQUIRY CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {inquiryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInquiryToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 z-10 text-center space-y-4"
            >
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h4 className="font-poppins text-lg font-bold text-primary">Delete Lead Record?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete the inquiry submitted by <strong className="text-slate-800 font-semibold">{inquiryToDelete.name}</strong>?
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setInquiryToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteInquiry}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold font-poppins hover:bg-red-700 shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
