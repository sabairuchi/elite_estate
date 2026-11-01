import { Shield, Eye, Lock, FileText, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">Corporate Standards</span>
        <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-2 font-light font-poppins">Last Updated: July 8, 2026</p>
      </div>

      {/* Main content body */}
      <div className="bg-white border border-slate-100 shadow-premium rounded-3xl p-8 sm:p-10 space-y-10 text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
        
        {/* Intro */}
        <div className="space-y-4">
          <p>
            At <strong>Elite Estates Real Estate Ltd.</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, store, and safeguard your details when you interact with our luxury residences catalog, schedule viewing tours, or contact our concierge desks.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" /> 1. Information We Collect
          </h2>
          <p>
            To provide our custom viewing and inquiry services, we collect information directly from you when you fill out forms on our website. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Identity & Contact Details</strong>: Full name, email address, and telephone coordinates.</li>
            <li><strong>Calendar & Scheduling Data</strong>: Preferred dates for booking private apartment viewings.</li>
            <li><strong>Inquiry Records</strong>: Stored messages, inquiries, and preferences related to specific properties.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" /> 2. How We Use Your Information
          </h2>
          <p>
            Your information is processed strictly to maintain high standards of service and customer care:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>To schedule and coordinate private property tours with local brokers.</li>
            <li>To answer general inquiry requests regarding leasing conditions, deposits, and specs.</li>
            <li>To distribute newsletter updates on newly listed luxury suites (only if you subscribe).</li>
            <li>To compile anonymous metrics to optimize our website loading and interface layouts.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" /> 3. Data Storage & Local Caching
          </h2>
          <p>
            For this demonstration version of the Elite Estates platform:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Forms and favorites data are cached locally inside your browser's <strong>`localStorage`</strong>. </li>
            <li>No database servers or tracking scripts are deployed.</li>
            <li>You can clear all stored inquiries, favorites, and cached listings at any time by clearing your browser cache or using the control panels in the secure Broker Console.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" /> 4. Security & Third-Party Sharing
          </h2>
          <p>
            We implement custom styling protocols and security simulations to prevent unauthorized access to your browser storage.
          </p>
          <p>
            <strong>We do not sell, rent, or lease your personal data.</strong> Your details are only visible to you locally and will only be shared with verified listing brokers when transitioning to formal lease signatures.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" /> 5. Contacting the Concierge Desk
          </h2>
          <p>
            If you have questions about this privacy statement or wish to request data erasure from your browser cache, please reach out to our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <Mail className="h-4.5 w-4.5 text-accent shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Inquiry</div>
                <div className="text-xs text-primary font-medium">concierge@eliteestate.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <Phone className="h-4.5 w-4.5 text-accent shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Corporate Line</div>
                <div className="text-xs text-primary font-medium">+1 (416) 555-0199</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
