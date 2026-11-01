import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Calendar, Clock, User, Mail, Phone, CheckCircle2, 
  ChevronDown, LayoutDashboard, Building2, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addInquiry } from '../utils/authStorage';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Pre-fill user data into booking modal if logged in
  useEffect(() => {
    if (user) {
      setBookingName(user.name);
      setBookingEmail(user.email);
      setBookingPhone(user.phone || '');
    }
  }, [user, showBookingModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { name: string; path: string; disabled?: boolean }[] = [
    { name: 'Home', path: '/' },
    { name: 'Listings', path: '/listings' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Record inquiry to persistent storage
    addInquiry({
      propertyId: '1',
      propertyTitle: 'The Grand View Suite (General VIP Tour)',
      type: 'tour',
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      date: bookingDate,
      timeSlot: bookingTime,
      message: 'Private tour schedule requested via Navbar.',
      status: 'pending',
      userId: user?.id
    });

    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setShowBookingModal(false);
    }, 2500);
  };

  const handleSignOut = () => {
    setShowUserDropdown(false);
    logout();
    navigate('/', { replace: true });
  };

  const dashboardRoute = user?.role === 'agent' ? '/dashboard/agent' : '/dashboard/buyer';

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logoImg}
                alt="Elite Estates Logo"
                className="h-11 w-11 rounded-lg object-cover bg-white border border-slate-100 p-0.5 shadow-sm group-hover:border-accent/40 transition-colors"
              />
              <span className="font-cormorant text-2xl font-bold tracking-widest text-primary uppercase flex items-center">
                Elite<span className="text-accent font-medium italic normal-case ml-1">Estates</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.disabled) {
                  return (
                    <div key={link.name} className="relative group cursor-not-allowed">
                      <span className="font-medium text-slate-400 transition-colors duration-200">
                        {link.name}
                      </span>
                      <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 scale-0 rounded bg-secondary px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 whitespace-nowrap shadow-lg">
                        Coming Soon
                      </span>
                    </div>
                  );
                }

                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative font-medium transition-colors duration-200 hover:text-accent ${
                      isActive ? 'text-accent' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Section (Auth Buttons / User Dropdown + Book Viewing) */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                /* Authenticated User Menu */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80 bg-slate-50/50 cursor-pointer"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-accent/40"
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-primary block leading-tight max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent block leading-none">
                        {user.role === 'agent' ? 'Agent' : 'Buyer'}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                          <p className="text-xs font-semibold text-primary truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          {user.role === 'agent' ? (
                            <Link
                              to="/dashboard/agent"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-accent/10 hover:text-accent transition-colors"
                            >
                              <Building2 className="h-4 w-4 text-accent" />
                              Agent Workspace
                            </Link>
                          ) : (
                            <Link
                              to="/dashboard/buyer"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-accent/10 hover:text-accent transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4 text-accent" />
                              Buyer Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Unauthenticated Sign In / Register */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="font-poppins text-xs font-semibold text-slate-700 hover:text-accent transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full border border-slate-300 hover:border-accent hover:text-accent px-4 py-2 font-poppins text-xs font-semibold text-primary transition-all duration-200 shadow-2xs"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Book Viewing CTA Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="rounded-full bg-primary px-5 py-2.5 font-poppins text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-accent hover:text-primary hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Book Viewing
              </button>
            </div>

            {/* Mobile Hamburger Menu Icon */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-100 bg-white"
            >
              <div className="space-y-1 px-4 py-4 sm:px-6">
                {/* Mobile User Profile Header if logged in */}
                {isAuthenticated && user && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-accent/40"
                      />
                      <div>
                        <p className="text-xs font-bold text-primary">{user.name}</p>
                        <p className="text-[10px] text-accent font-bold uppercase">{user.role === 'agent' ? 'Licensed Agent' : 'Verified Buyer'}</p>
                      </div>
                    </div>
                    <Link
                      to={dashboardRoute}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors"
                    >
                      {user.role === 'agent' ? 'Workspace' : 'Dashboard'}
                    </Link>
                  </div>
                )}

                {navLinks.map((link) => {
                  if (link.disabled) {
                    return (
                      <div
                        key={link.name}
                        className="flex items-center justify-between px-3 py-3 font-medium text-slate-400 cursor-not-allowed"
                      >
                        <span>{link.name}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          Coming Soon
                        </span>
                      </div>
                    );
                  }

                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-lg px-3 py-3 font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile Auth Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full rounded-lg border border-slate-200 py-2.5 text-center font-poppins font-semibold text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full rounded-lg bg-accent py-2.5 text-center font-poppins font-semibold text-xs text-primary hover:bg-accent-light"
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleSignOut();
                      }}
                      className="w-full rounded-lg bg-red-50 text-red-600 py-2.5 text-center font-poppins font-semibold text-xs hover:bg-red-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowBookingModal(true);
                    }}
                    className="w-full rounded-lg bg-primary py-3 text-center font-poppins font-semibold text-white shadow-lg hover:bg-accent hover:text-primary transition-all duration-300 cursor-pointer"
                  >
                    Book Viewing
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Book Viewing Modal (Glassmorphic Backdrop Overlay) */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100"
            >
              {/* Header */}
              <div className="bg-primary px-6 py-5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-poppins text-lg font-bold">Schedule a Private Viewing</h3>
                  <p className="text-xs text-slate-300 mt-1">Experience luxury and comfort firsthand</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="rounded-full p-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {bookingSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h4 className="font-poppins text-xl font-bold text-primary">Viewing Requested!</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs">
                      We have received your schedule request. An Elite Estates coordinator will contact you shortly to confirm the appointment.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-slate-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-slate-400" /> Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" /> Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" /> Preferred Time
                        </label>
                        <select
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent bg-white"
                        >
                          <option value="">Select Time Slot</option>
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 7 PM)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary py-3 font-poppins font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-accent hover:text-primary transition-all duration-300 mt-2 cursor-pointer"
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
    </>
  );
}
