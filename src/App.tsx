import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Existing Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Authentication & Role-Based Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import BuyerDashboard from './pages/BuyerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Existing Public Pages */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/listings"
          element={
            <PageWrapper>
              <Listings />
            </PageWrapper>
          }
        />
        <Route
          path="/property/:id"
          element={
            <PageWrapper>
              <PropertyDetails />
            </PageWrapper>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageWrapper>
              <PrivacyPolicy />
            </PageWrapper>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <PageWrapper>
              <TermsOfService />
            </PageWrapper>
          }
        />

        {/* Authentication Pages */}
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageWrapper>
              <ForgotPassword />
            </PageWrapper>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PageWrapper>
              <ResetPassword />
            </PageWrapper>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <PageWrapper>
              <Unauthorized />
            </PageWrapper>
          }
        />

        {/* Protected Role-Based Dashboards */}
        <Route
          path="/dashboard/buyer"
          element={
            <PageWrapper>
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard/agent"
          element={
            <PageWrapper>
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <PageWrapper>
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            </PageWrapper>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <div className="mx-auto max-w-md px-4 py-32 text-center">
                <span className="text-4xl font-extrabold text-accent">404</span>
                <h1 className="font-poppins text-2xl font-bold text-primary mt-4 mb-2">Page Not Found</h1>
                <p className="text-sm text-slate-500 font-light mb-8">The luxury residence details or page you requested could not be located.</p>
                <Link
                  to="/"
                  className="inline-block rounded-full bg-primary text-white hover:bg-accent hover:text-primary px-8 py-3 font-poppins font-bold text-xs shadow-md transition-all duration-300"
                >
                  Return Home
                </Link>
              </div>
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
}
