import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Star, Users, Award, Clock, Phone, Activity, HeartPulse } from 'lucide-react';
import { heroDoctorImage } from '../data/hospitalData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreFeatures: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreFeatures }) => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-12 lg:py-20 bg-[#F5F9FF] dark:bg-slate-950">
      {/* Background Soft Aura Blurs */}
      <div className="absolute w-96 h-96 bg-[#EAF4FF] dark:bg-blue-950/40 rounded-full blur-3xl opacity-70 top-10 right-10 pointer-events-none"></div>
      <div className="absolute w-80 h-80 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 bottom-10 left-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-[#0B3D91] dark:text-blue-300 text-xs sm:text-sm font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              <span>Trusted by 20,000+ Patients</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Your Health. <br />
              <span className="text-[#0B3D91] dark:text-blue-400">
                Our Priority.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience seamless healthcare with our intelligent HMS. Manage records, book specialists, and access care anywhere, anytime.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#2563EB] hover:bg-[#0B3D91] shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More</span>
              </button>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">24/7 Intake</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Immediate Care</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">4.9 / 5.0</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">20k+ Reviews</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Top Rated</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">JCI Accredited</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Doctor Image Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-[340px] sm:w-[420px] lg:w-[440px] h-[480px] sm:h-[520px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-4 overflow-hidden border border-blue-100 dark:border-slate-800 group">
              
              {/* Radial Doctor Gradient Background */}
              <div className="absolute inset-0 doctor-gradient opacity-15"></div>

              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[32px] overflow-hidden relative">
                <img
                  src={heroDoctorImage}
                  alt="MediCare Professional Doctor"
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Glass Overlay Card at bottom */}
                <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-3xl flex items-center justify-between border border-white/60 dark:border-slate-700/60 shadow-lg">
                  <div>
                    <p className="text-xs font-bold text-[#0B3D91] dark:text-blue-400 uppercase tracking-wider mb-1">Active Consultant</p>
                    <p className="font-bold text-base text-slate-900 dark:text-white font-heading">Dr. Sarah Johnson</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Senior Cardiologist &bull; 12Y Exp.</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">4.9</span>
                  </div>
                </div>

              </div>

              {/* Floating Badge Top Left */}
              <div className="absolute top-8 left-8 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Safety Guarantee</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">100% HIPAA Safe</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Geometric Statistics Section Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl lg:rounded-[32px] bg-[#0B3D91] text-white shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">20,000+</p>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Patients Served</p>
          </div>

          <div className="text-center relative">
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/20"></div>
            <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">150+</p>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Expert Doctors</p>
          </div>

          <div className="text-center relative">
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/20"></div>
            <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-1">25+</p>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Departments</p>
          </div>

          <div className="text-center lg:text-left relative flex items-center justify-center lg:justify-start gap-4">
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/20"></div>
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center shrink-0 shadow-md">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Emergency Hotline</p>
              <p className="text-sky-300 text-lg font-mono font-bold tracking-tight">1-800-MEDICARE</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
