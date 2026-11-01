import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { getPublicProperties } from '../utils/db';
import type { Property } from '../types/property';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const data = getPublicProperties().filter(p => p.featured).slice(0, 6);
    setFeaturedProperties(data);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      rating: 5,
      review: 'Finding my penthouse through Elite Estate was a seamless experience. The quality of the properties is unparalleled, and the booking process was extremely transparent.'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Tech Lead',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      rating: 5,
      review: 'The virtual scheduling tool and detail sheets made it incredibly easy for me to pick a space that fits my hybrid lifestyle. Five stars for the service!'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: 'Interior Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      rating: 5,
      review: 'As a designer, I appreciate structural flow and modern finishes. The apartments listed here represent the absolute best in modern premium architecture.'
    }
  ];

  const benefits = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
      title: 'Premium Apartments',
      description: 'Every apartment is hand-selected and undergoes a rigorous inspection for design, structure, and amenities.'
    },
    {
      icon: <Compass className="h-8 w-8 text-accent" />,
      title: 'Prime Locations',
      description: 'Properties situated in close proximity to business hubs, rich culture districts, and natural waterfronts.'
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-accent" />,
      title: 'Transparent Pricing',
      description: 'Zero hidden fees. We work directly with owners to establish fair market rates and transparent rental terms.'
    }
  ];

  return (
    <div className="pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image with Parallax / Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80"
            alt="Luxury apartment interior"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[pulse_8s_infinite]"
          />
          {/* Dark Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {/* Tagline */}
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-accent uppercase border border-accent/20 mb-6">
              Exclusive Luxury Living
            </span>
            
            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find Your Perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                Apartment Suite
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-light mb-10 max-w-2xl mx-auto">
              Discover hand-selected modern apartments designed for ultimate comfort, absolute convenience, and your premium lifestyle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/listings"
                className="w-full sm:w-auto rounded-full bg-accent text-primary px-8 py-4 font-poppins font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white px-8 py-4 font-poppins font-bold text-sm hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar Component */}
      <SearchBar />

      {/* Featured Listings Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Selection</span>
          <h2 className="font-poppins text-3xl font-extrabold text-primary tracking-tight mt-2 mb-4">
            Featured Residences
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Browse our six premium apartments. Each features architectural excellence, rich smart amenities, and prime urban locations.
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-900 text-white mt-32 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent)] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-poppins text-3xl font-extrabold text-white mt-2 mb-4">
              Designed For Better Living
            </h2>
            <p className="text-sm text-slate-400">
              We streamline the search for luxury rentals by prioritizing quality, transparency, and tailored client support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-accent/40 transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-accent mb-6 transition-all duration-500 group-hover:bg-accent group-hover:text-primary">
                  {benefit.icon}
                </div>
                <h3 className="font-poppins text-lg font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Reviews</span>
          <h2 className="font-poppins text-3xl font-extrabold text-primary mt-2 mb-4">
            What Our Residents Say
          </h2>
          <p className="text-sm text-slate-500">
            Read comments from families and professionals who found their dream apartments through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-premium flex flex-col justify-between h-full hover:shadow-premium-hover transition-shadow duration-300">
              <div>
                {/* Stars */}
                <div className="flex items-center space-x-1 text-accent mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent" />
                  ))}
                </div>
                {/* Review Text */}
                <p className="text-slate-600 text-sm italic leading-relaxed font-light mb-8">
                  "{t.review}"
                </p>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-4 border-t border-slate-50 pt-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="font-poppins font-bold text-sm text-primary">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-white py-16 px-8 md:px-16 text-center border border-slate-800 shadow-2xl">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent)] rounded-full" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-slate-800/40 rounded-full blur-xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light mb-8">
              Let us assist you in choosing the perfect living space. Explore our catalog of modern residences, or speak to a dedicated leasing specialist today.
            </p>
            <Link
              to="/listings"
              className="inline-block rounded-full bg-accent text-primary px-8 py-3.5 font-poppins font-bold text-sm shadow-lg shadow-accent/25 hover:bg-accent-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              Explore Apartments
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
