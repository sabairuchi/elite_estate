import { Scale, FileText, CheckCircle2, ShieldAlert, Mail, Phone } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">Corporate Terms</span>
        <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400 mt-2 font-light font-poppins">Last Updated: July 8, 2026</p>
      </div>

      {/* Main content body */}
      <div className="bg-white border border-slate-100 shadow-premium rounded-3xl p-8 sm:p-10 space-y-10 text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
        
        {/* Intro */}
        <div className="space-y-4">
          <p>
            Welcome to <strong>Elite Estates</strong>. By accessing our website, browsing our luxury listings catalog, using our interactive blueprints, or submitting contact inquiries, you agree to comply with and be bound by the following Terms of Service. Please review these conditions carefully.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-accent" /> 1. Acceptance of Terms
          </h2>
          <p>
            By using this website, you represent that you are at least 18 years of age and possess the legal authority to enter into lease discussions. We reserve the right to modify these terms at any time without prior warning. Continued use of the portal implies acceptance of updated terms.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" /> 2. Listings Disclaimers & Accuracy
          </h2>
          <p>
            Please note that this website is a high-fidelity demonstration prototype of the Elite Estates network:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mock Data</strong>: All property listings, pricing estimates, neighborhood coordinates, and amenities lists are for presentation and preview purposes.</li>
            <li><strong>Rental Costs</strong>: Rental costs displayed in CAD represent estimates. Final pricing, security deposit terms, and application details are subject to official lease documentation.</li>
            <li><strong>Interactive CAD Blueprints</strong>: The styled CSS room grids and dimensions are provided as realistic proportions for design consistency. Actual room scales, architectural plans, and structural fittings may vary slightly.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" /> 3. Concierge Booking & Form Use
          </h2>
          <p>
            Scheduling a viewing tour or submitting a general inquiry form on our properties constitutes a request, not a confirmed reservation.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Our concierge and brokerage teams will reach out separately to confirm physical viewing schedules based on current availability.</li>
            <li>You agree to provide true, accurate, and current contact details (Name, Email, Phone) when using our inquiry forms.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3.5 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" /> 4. Intellectual Property
          </h2>
          <p>
            All content on this site, including the Elite Estates logo, custom CSS glassmorphism styling, layout systems, photography assemblies, and texts, is the intellectual property of Elite Estates Real Estate Ltd. and may not be copied, repackaged, or reproduced without express consent.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <h2 className="font-poppins font-bold text-primary text-base sm:text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" /> 5. Questions & Corporate Coordinates
          </h2>
          <p>
            If you have questions regarding these terms, or wish to clarify specific property rules, please contact our administrative desk:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <Mail className="h-4.5 w-4.5 text-accent shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Concierge Email</div>
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
