import React, { useState } from 'react';
import { Cross, Building2, Phone, Mail, MapPin, Send, CheckCircle2, Heart } from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0B3D91] text-white pt-16 pb-12 dark:bg-slate-950 border-t border-blue-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1: Logo & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-[#0B3D91] shadow-md">
                <Cross className="w-6 h-6 text-[#0B3D91]" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-white tracking-tight leading-none block">
                  MediCare HMS
                </span>
                <span className="text-[10px] font-semibold text-sky-300 tracking-widest uppercase block">
                  Hospital Management System
                </span>
              </div>
            </div>

            <p className="text-sm text-blue-100 dark:text-slate-300 leading-relaxed max-w-sm">
              MediCare is a state-of-the-art healthcare provider and digital Hospital Management System dedicated to clinical excellence, patient privacy, and intelligent healthcare delivery.
            </p>

            {/* Emergency Box */}
            <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900 border border-white/10 backdrop-blur-md space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>24/7 Emergency Hotline</span>
              </div>
              <div className="text-lg font-extrabold text-white">1-800-MEDICARE</div>
              <div className="text-[11px] text-blue-200">Trauma Unit & Rapid Ambulance Dispatch</div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold font-heading text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              <li><a href="#home" className="hover:text-sky-300 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-sky-300 transition-colors">Key Features</a></li>
              <li><a href="#departments" className="hover:text-sky-300 transition-colors">Medical Departments</a></li>
              <li><a href="#doctors" className="hover:text-sky-300 transition-colors">Consulting Doctors</a></li>
              <li><a href="#hms-features" className="hover:text-sky-300 transition-colors">Patient & Admin Portal</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-300 transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-sky-300 transition-colors">Patient Reviews</a></li>
              <li><a href="#faq" className="hover:text-sky-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div className="space-y-3">
            <h4 className="text-base font-bold font-heading text-white uppercase tracking-wider">Departments</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <a href="#departments" className="hover:text-sky-300 transition-colors">
                    {dept.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-bold font-heading text-white uppercase tracking-wider">Contact & Newsletter</h4>
            
            <div className="space-y-2 text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <span>500 Healthcare Blvd, Suite 100, Medical District</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-300 shrink-0" />
                <span>contact@medicarehms.org</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <div className="text-xs font-medium text-blue-200">Subscribe to Health Newsletter</div>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white/10 dark:bg-slate-800 border border-white/20 text-xs text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-[#0B3D91] transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-8 border-t border-blue-900/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} MediCare Hospital Management System. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#hipaa" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">HIPAA Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
