import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CaptchaChallenge from '../components/auth/CaptchaChallenge';
import logoImg from '../assets/logo.jpg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isCaptchaValid) {
      setErrorMessage('Please complete the security verification challenge before continuing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success && res.token) {
        setGeneratedToken(res.token);
      } else {
        setErrorMessage(res.error || 'Failed to request password reset.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetLink = generatedToken ? `${window.location.origin}/reset-password?token=${generatedToken}` : '';

  const handleCopy = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <h2 className="font-poppins text-2xl font-bold tracking-tight">Password Recovery</h2>
            <p className="text-xs text-slate-300 mt-1 font-light max-w-xs sm:max-w-sm">
              Enter your registered email address to receive a secure single-use recovery link.
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

            {!generatedToken ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@eliteestate.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* CAPTCHA Challenge */}
                <CaptchaChallenge onVerify={setIsCaptchaValid} />

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
                      <span>Send Recovery Instructions</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-2"
              >
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-primary">Recovery Link Generated</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    A secure password reset link valid for <strong>15 minutes</strong> has been generated for <strong>{email}</strong>.
                  </p>
                </div>

                {/* Simulated Email Delivery Link Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <ShieldCheck className="h-4 w-4 text-accent" /> Secure Single-Use Reset Token
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      Expires in 15 mins
                    </span>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 truncate">
                    {resetLink}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                    <Link
                      to={`/reset-password?token=${generatedToken}`}
                      className="flex-1 py-2 px-3 rounded-lg bg-accent text-primary hover:bg-accent-light text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Open Reset Link</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Did not receive it or need another email?{' '}
                  <button
                    onClick={() => {
                      setGeneratedToken(null);
                      setEmail('');
                    }}
                    className="text-accent underline font-medium hover:text-accent-dark ml-1"
                  >
                    Try Again
                  </button>
                </p>
              </motion.div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-accent transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
