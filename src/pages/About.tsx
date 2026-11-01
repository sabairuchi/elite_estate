import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Award, ThumbsUp, ArrowRight } from 'lucide-react';

export default function About() {
  const stats = [
    { value: '500+', label: 'Happy Families' },
    { value: '100+', label: 'Properties' },
    { value: '15+', label: 'Cities Covered' },
    { value: '98%', label: 'Retention Rate' }
  ];

  const team = [
    {
      name: 'Victoria Vance',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=350&q=80'
    },
    {
      name: 'Marcus Sterling',
      role: 'Head of Sales & Acquisitions',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=350&q=80'
    },
    {
      name: 'Sophia Laurent',
      role: 'Lead Interior Architect',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=350&q=80'
    },
    {
      name: 'Julian Hayes',
      role: 'Chief Relations Officer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=350&q=80'
    }
  ];

  const values = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
      title: 'Integrity First',
      description: 'We believe absolute honesty is the key to building lasting partnerships in premium real estate.'
    },
    {
      icon: <Award className="h-6 w-6 text-accent" />,
      title: 'Structural Quality',
      description: 'We do not compromise. Every suite listed is vetted by top-tier architectural consultants.'
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-accent" />,
      title: 'Concierge Care',
      description: 'From virtual tour bookings to final lease signatures, our team offers undivided support.'
    }
  ];

  return (
    <div className="pb-20">
      
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Who We Are</span>
            <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 mb-6">
              Our Journey To Redefine Luxury Rentals
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
              Established with the vision of curating premier spaces, Elite Estates has grown into a trusted advisor for luxury residences and penthouses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story & Image */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Story</span>
            <h2 className="font-poppins text-3xl font-extrabold text-primary tracking-tight mt-2 mb-6">
              Empowering Modern Lifestyles Since 2018
            </h2>
            <div className="space-y-4 text-slate-500 text-sm leading-relaxed font-light">
              <p>
                Elite Estates was founded by a collective of real estate brokers and luxury interior designers who observed a recurring gap in high-end rental property listings: a lack of transparency, sub-par listing accuracy, and slow, friction-filled leasing support.
              </p>
              <p>
                To address this, we set out to build a curated destination where discerning renters could browse beautiful loft, duplex, and penthouse designs. We began with just a dozen exclusive spaces in Manhattan and have expanded to encompass hundreds of premium properties in 15+ major cities.
              </p>
              <p>
                Every listing is verified by a member of our specialist team, offering detailed floor plans, certified energy ratings, and a seamless digital booking experience.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
              alt="Elite Estate property meeting"
              className="w-full h-full object-cover"
            />
            {/* Soft accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100 flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-poppins text-lg font-bold text-primary mb-3">Our Core Mission</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  To guide modern professionals and active families in selecting premium, designer spaces that feel like home. We remove the uncertainty of luxury leasing by ensuring listing accuracy and direct agent support.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100 flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-poppins text-lg font-bold text-primary mb-3">Our Global Vision</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  To become the leading digital destination for designer living spaces. We envision a world where luxury accommodation can be booked, verified, and settled with simple, digital-first real estate tools.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-primary text-white rounded-3xl p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="font-poppins text-4xl sm:text-5xl font-extrabold text-accent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Ideals</span>
          <h2 className="font-poppins text-3xl font-extrabold text-primary mt-2 mb-4">
            The Principles We Run On
          </h2>
          <p className="text-sm text-slate-500">
            Whether you are a tenant looking for a penthouse or a landlord leasing out a loft, our team is bound by three core values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-shadow duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-6">
                {v.icon}
              </div>
              <h3 className="font-poppins text-lg font-bold text-primary mb-3">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">People</span>
          <h2 className="font-poppins text-3xl font-extrabold text-primary mt-2 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-sm text-slate-500">
            A diverse group of industry specialists committed to making your luxury rental process simple and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 border border-slate-100 text-center">
              <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h4 className="font-poppins font-bold text-base text-primary mb-1">{member.name}</h4>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-primary text-white rounded-3xl p-12 text-center border border-slate-800 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent)] pointer-events-none" />
          <h3 className="font-poppins text-2xl sm:text-3xl font-bold mb-4">Explore Our Curated Catalog</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-light mb-8">
            Ready to find your next home? Browse our high-end penthouses and flats, or consult with our leasing consultants today.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-8 py-3.5 font-poppins font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            Consult a Broker <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
