import React from 'react';
import { Users, UserCheck, Building2, Clock, ThumbsUp, Award, CheckCircle2, Hospital } from 'lucide-react';
import { hospitalBuildingImage } from '../data/hospitalData';

export const WhyChooseUs: React.FC = () => {
  const stats = [
    { label: 'Patients Served', value: '20,000+', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Expert Doctors', value: '150+', icon: UserCheck, color: 'text-sky-600 dark:text-sky-400' },
    { label: 'Specialized Departments', value: '25', icon: Building2, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Emergency Service', value: '24/7', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Patient Satisfaction', value: '99%', icon: ThumbsUp, color: 'text-amber-500' },
    { label: 'Years Experience', value: '15+', icon: Award, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const highlights = [
    'JCI Accredited International Quality Standard',
    'Integrated Cloud Electronic Health Records',
    'Zero Waiting Time Emergency Triage Protocol',
    'Seamless Multi-specialty Surgical Centers',
    '24/7 Remote Telemedicine & Video Consultation',
    'Transparent Online Billing & Insurance Approval'
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-[#F5F9FF] to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Side: Hospital Image + Overlay Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
              <img
                src={hospitalBuildingImage}
                alt="MediCare State-of-the-Art Hospital"
                className="w-full h-[400px] lg:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91]/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel text-white">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white text-[#0B3D91] rounded-xl shadow-md">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-heading text-slate-900 dark:text-white">MediCare Central Hospital</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Advanced Tertiary Care & Academic Medical Center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              Why Choose MediCare HMS
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              Pioneering Modern Healthcare with Trust & Innovation
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              At MediCare Hospital, we combine world-class medical expertise with an intelligent digital infrastructure to deliver compassionate, fast, and precise healthcare services for every patient.
            </p>

            {/* Checkmark List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 text-center group transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
