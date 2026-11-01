import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();

  const userDashboard = user?.role === 'agent' ? '/dashboard/agent' : '/dashboard/buyer';
  const roleName = user?.role === 'agent' ? 'Licensed Agent / Seller' : 'Verified Buyer';

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-background relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-100 text-center relative overflow-hidden"
      >
        <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-sm">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
          Restricted Portal Area
        </span>

        <h1 className="font-poppins text-2xl font-bold text-primary mt-4 mb-2">Access Restricted</h1>
        
        <p className="text-xs text-slate-500 font-light mb-6 leading-relaxed">
          You are currently signed in as a <strong className="text-primary">{roleName}</strong>. You do not have permission to view this specific portal.
        </p>

        <div className="space-y-3">
          <Link
            to={userDashboard}
            className="w-full rounded-xl bg-primary py-3.5 px-4 font-poppins font-semibold text-xs text-white shadow-md hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Go to My {user?.role === 'agent' ? 'Agent' : 'Buyer'} Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/"
            className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 px-4 font-poppins font-semibold text-xs text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
