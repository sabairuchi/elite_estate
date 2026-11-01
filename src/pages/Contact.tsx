import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pb-20">
      
      {/* Contact Hero */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Connect</span>
            <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 mb-6">
              Get In Touch With Our Team
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
              Have questions about a specific residence, or want to schedule a portfolio review? Contact us, and a broker will reach out within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Grid: Form and Information */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Contact Form: 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-100 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="font-poppins text-2xl font-bold text-primary mb-3">Message Received!</h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-light">
                    Thank you for reaching out. A dedicated leasing specialist has received your inquiry and will follow up with you at <strong>{formData.email}</strong> shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h2 className="font-poppins text-2xl font-bold text-primary mb-6">Send A Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      {/* Subject */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Inquiry about Luminary Penthouse"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please write details about your preferred move-in date, room configuration, or styling details..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary text-white hover:bg-accent hover:text-primary py-4 font-poppins font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <Send className="h-4 w-4" /> Send Message
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Contact Details & Map: 5 cols */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            {/* Info Cards Container */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
              <h2 className="font-poppins text-xl font-bold text-white mb-6">Concierge Details</h2>
              
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Phone</h4>
                  <p className="text-sm text-slate-200 font-light mt-1">+1 (800) 555-0199</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Inquiry</h4>
                  <p className="text-sm text-slate-200 font-light mt-1">concierge@eliteestate.com</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-accent shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Hours</h4>
                  <p className="text-sm text-slate-200 font-light mt-1">
                    Monday - Friday: 9 AM - 6 PM<br />
                    Saturday: 10 AM - 4 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>



          </div>

        </div>
      </section>

    </div>
  );
}
