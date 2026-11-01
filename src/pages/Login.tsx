import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CaptchaChallenge from '../components/auth/CaptchaChallenge';
import logoImg from '../assets/logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isCaptchaValid) {
      setErrorMessage('Please complete the security verification challenge before logging in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          // If role is agent go to /dashboard/agent, if buyer go to /dashboard/buyer
          if (email.includes('agent')) {
            navigate('/dashboard/agent', { replace: true });
          } else {
            navigate('/dashboard/buyer', { replace: true });
          }
        }
      } else {
        setErrorMessage(res.error || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for testers & evaluators
  const fillDemo = (role: 'buyer' | 'agent') => {
    if (role === 'buyer') {
      setEmail('buyer@eliteestate.com');
      setPassword('EliteBuyer2026!');
    } else {
      setEmail('agent@eliteestate.com');
      setPassword('EliteAgent2026!');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-primary px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />

            {/* Go Back Option in Right Upper Corner */}
            <Link
              to="/"
              className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 hover:text-white border border-white/15 backdrop-blur-sm transition-all duration-200 shadow-sm group z-20"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Home</span>
            </Link>

            <div className="flex items-center space-x-3 mb-4">
              <img src={logoImg} alt="Elite Estates Logo" className="h-10 w-10 rounded-lg object-cover bg-white p-0.5 border border-white/20" />
              <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase flex items-center">
                Elite<span className="text-accent font-medium italic normal-case ml-1">Estates</span>
              </span>
            </div>
            <h2 className="font-poppins text-2xl font-bold tracking-tight">Client & Agent Portal</h2>
            <p className="text-xs text-slate-300 mt-1 font-light">
              Sign in to manage luxury bookings, inquiries, and residence portfolios.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> One-Click Demo Access:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fillDemo('buyer')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-700 hover:border-accent hover:text-accent transition-colors shadow-xs"
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('agent')}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-700 hover:border-accent hover:text-accent transition-colors shadow-xs"
              >
                Agent / Seller
              </button>
            </div>
          </div>

          {/* Form Content */}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@eliteestate.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" /> Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-400 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Security CAPTCHA */}
              <CaptchaChallenge onVerify={setIsCaptchaValid} />

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-accent focus:ring-accent h-4 w-4"
                  />
                  <span>Keep me signed in for 72 hours</span>
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
                    <span>Authenticate Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Divider & Register link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an Elite State account yet?{' '}
                <Link to="/register" className="font-semibold text-primary hover:text-accent transition-colors ml-1">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
