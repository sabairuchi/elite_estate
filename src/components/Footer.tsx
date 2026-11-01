import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };



  return (
    <footer className="bg-primary text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logoImg} alt="Elite Estates Logo" className="h-11 w-11 rounded-lg object-cover bg-white p-0.5 border border-white/10 group-hover:border-accent/40 transition-colors" />
              <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase flex items-center">
                Elite<span className="text-accent font-medium italic normal-case ml-1">Estates</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curating luxury living spaces in prime locations. We connect discerning clients with their ideal apartments through transparency and exceptional design.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-accent hover:text-primary transition-all duration-300 border border-white/10">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-accent hover:text-primary transition-all duration-300 border border-white/10">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-accent hover:text-primary transition-all duration-300 border border-white/10">
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-accent hover:text-primary transition-all duration-300 border border-white/10">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-poppins font-semibold text-white text-base tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors duration-200">Home Page</Link>
              </li>
              <li>
                <Link to="/listings" className="hover:text-accent transition-colors duration-200">Our Listings</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors duration-200">Contact & Support</Link>
              </li>

            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="font-poppins font-semibold text-white text-base tracking-wider uppercase">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span className="text-slate-400">+1 (416) 555-0199</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span className="text-slate-400">concierge@eliteestate.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-6">
            <h3 className="font-poppins font-semibold text-white text-base tracking-wider uppercase">Newsletter</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to receive updates on newly listed luxury suites and exclusive private offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-accent text-primary p-2.5 font-bold hover:bg-accent-light transition-all duration-300 shrink-0"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Elite Estates Real Estate Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-accent transition-colors text-slate-500 font-normal text-xs">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-accent transition-colors text-slate-500 font-normal text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
