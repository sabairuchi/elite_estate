import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePasswordResetToken } from '../utils/authStorage';
import logoImg from '../assets/logo.jpg';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [tokenStatus, setTokenStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [tokenError, setTokenError] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      setTokenError('No reset token was provided in the link.');
      return;
    }

    const check = validatePasswordResetToken(token);
    if (check.valid && check.resetData) {
      setTokenStatus('valid');
      setTargetEmail(check.resetData.email);
    } else {
      setTokenStatus('invalid');
      setTokenError(check.error || 'The reset token is invalid or has expired.');
    }
  }, [token]);

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strengthScore];
  const strengthColor = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-600'][strengthScore];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(token, newPassword);
      if (res.success) {
        setResetSuccess(true);
      } else {
        setErrorMessage(res.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-8 text-white relative overflow-hidden">
            {/* Go Back Option in Right Upper Corner */}
            <Link
              to="/login"
              className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 hover:text-white border border-white/15 backdrop-blur-sm transition-all duration-200 shadow-sm group z-20"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Go Back</span>
            </Link>

            <div className="flex items-center space-x-3 mb-4">
              <img src={logoImg} alt="Elite Estates Logo" className="h-10 w-10 rounded-lg object-cover bg-white p-0.5 border border-white/20" />
              <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase flex items-center">
                Elite<span className="text-accent font-medium italic normal-case ml-1">Estates</span>
              </span>
            </div>
            <h2 className="font-poppins text-2xl font-bold tracking-tight">Create New Password</h2>
            <p className="text-xs text-slate-300 mt-1 font-light max-w-xs sm:max-w-sm">
              Enter and confirm your new secure password to restore access to your account.
            </p>
          </div>

          <div className="p-8">
            {tokenStatus === 'checking' && (
              <div className="py-12 text-center">
                <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-accent animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-medium">Validating recovery token...</p>
              </div>
            )}

            {tokenStatus === 'invalid' && (
              <div className="py-6 text-center space-y-5">
                <div className="h-14 w-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-primary">Invalid or Expired Token</h3>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">{tokenError}</p>
                </div>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-poppins font-semibold text-white hover:bg-accent hover:text-primary transition-all duration-300 shadow-md"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Request New Reset Link
                </Link>
              </div>
            )}

            {tokenStatus === 'valid' && !resetSuccess && (
              <div>
                <div className="mb-6 p-3 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-2 text-xs text-primary font-medium">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    Resetting password for: <strong>{targetEmail}</strong>
                  </span>
                </div>

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
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-slate-400" /> New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-slate-400" /> Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary py-3.5 font-poppins font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>Update Password & Save</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {resetSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-5"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-poppins text-xl font-bold text-primary">Password Successfully Updated!</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                    Your password has been securely updated and your previous reset token has been expired.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login', { replace: true })}
                  className="w-full rounded-xl bg-primary py-3.5 font-poppins font-semibold text-white shadow-lg hover:bg-accent hover:text-primary transition-all duration-300"
                >
                  Proceed to Sign In
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
