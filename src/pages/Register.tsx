import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, Building2, BadgeCheck, Eye, EyeOff, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CaptchaChallenge from '../components/auth/CaptchaChallenge';
import logoImg from '../assets/logo.jpg';
import type { UserRole } from '../types/auth';

export default function Register() {
  const [role, setRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strengthScore];
  const strengthColor = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-600'][strengthScore];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!isCaptchaValid) {
      setErrorMessage('Please complete the security verification challenge before continuing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name,
        email,
        phone,
        password,
        role,
        agencyName: role === 'agent' ? agencyName : undefined,
        licenseNumber: role === 'agent' ? licenseNumber : undefined
      });

      if (res.success) {
        if (role === 'agent') {
          navigate('/dashboard/agent', { replace: true });
        } else {
          navigate('/dashboard/buyer', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your information.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />

            {/* Go Back Option in Right Upper Corner */}
            <Link
              to="/login"
              className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 hover:text-white border border-white/15 backdrop-blur-sm transition-all duration-200 shadow-sm group z-20"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Sign In</span>
            </Link>

            <div className="flex items-center space-x-3 mb-4">
              <img src={logoImg} alt="Elite Estates Logo" className="h-10 w-10 rounded-lg object-cover bg-white p-0.5 border border-white/20" />
              <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase flex items-center">
                Elite<span className="text-accent font-medium italic normal-case ml-1">Estates</span>
              </span>
            </div>
            <h2 className="font-poppins text-2xl font-bold tracking-tight">Create Member Account</h2>
            <p className="text-xs text-slate-300 mt-1 font-light max-w-xs sm:max-w-sm">
              Join Elite State to access verified luxury listings, concierge services, and portfolio management.
            </p>
          </div>

          <div className="p-8">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-start gap-2.5"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                  Select Account Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`rounded-2xl p-4 text-left transition-all duration-200 border-2 cursor-pointer ${
                      role === 'buyer'
                        ? 'border-accent bg-accent/5 text-primary shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-poppins font-bold text-sm text-primary">Buyer / Client</span>
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                          role === 'buyer' ? 'border-accent bg-accent text-primary' : 'border-slate-300'
                        }`}
                      >
                        {role === 'buyer' && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug font-light">
                      Browse luxury suites, save favorites & book viewing appointments.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`rounded-2xl p-4 text-left transition-all duration-200 border-2 cursor-pointer ${
                      role === 'agent'
                        ? 'border-accent bg-accent/5 text-primary shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-poppins font-bold text-sm text-primary">Agent / Seller</span>
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                          role === 'agent' ? 'border-accent bg-accent text-primary' : 'border-slate-300'
                        }`}
                      >
                        {role === 'agent' && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug font-light">
                      Publish & manage luxury listings, review buyer inquiries & tours.
                    </p>
                  </button>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jonathan Sterling"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (416) 000-0000"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Conditional Agent Fields */}
              {role === 'agent' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-accent" /> Brokerage / Agency
                    </label>
                    <input
                      type="text"
                      required={role === 'agent'}
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Elite Sotheby's"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-accent" /> License Number
                    </label>
                    <input
                      type="text"
                      required={role === 'agent'}
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. RECO-ON-102938"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-slate-400" /> Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Password Strength</span>
                    <span className="font-semibold">{strengthText}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CAPTCHA Challenge */}
              <CaptchaChallenge onVerify={setIsCaptchaValid} />

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-accent focus:ring-accent h-4 w-4 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link to="/privacy-policy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary py-3.5 font-poppins font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already registered with Elite State?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-accent transition-colors ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
