import React from 'react';
import { UserPlus, Calendar, Stethoscope, HeartHandshake, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenBooking: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking, onOpenAuth }) => {
  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your secure patient profile in seconds or log in using your email/phone number.',
      icon: UserPlus,
      action: () => onOpenAuth('register'),
      buttonText: 'Sign Up'
    },
    {
      number: '02',
      title: 'Book Appointment',
      description: 'Choose your medical department, pick a top specialist, and select a convenient date & time slot.',
      icon: Calendar,
      action: onOpenBooking,
      buttonText: 'Book Slot'
    },
    {
      number: '03',
      title: 'Meet Doctor',
      description: 'Attend your in-person OPD consultation at our hospital or connect via HD video telemedicine.',
      icon: Stethoscope,
      action: onOpenBooking,
      buttonText: 'View Doctors'
    },
    {
      number: '04',
      title: 'Receive Treatment',
      description: 'Get personalized clinical care, access digital e-prescriptions, and track recovery on your portal.',
      icon: HeartHandshake,
      action: () => {},
      buttonText: 'Portal Records'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-[#0B3D91] dark:text-blue-300 uppercase tracking-widest">
            Simplified Patient Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            How MediCare HMS Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Getting exceptional medical care is simple, transparent, and hassle-free in just four easy steps.
          </p>
        </div>

        {/* 4-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-[#F5F9FF] dark:bg-slate-800/80 border border-blue-100/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                {/* Step Number & Connector */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-heading text-[#0B3D91] dark:text-blue-400 opacity-80">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#0B3D91] text-white flex items-center justify-center shadow-md group-hover:bg-blue-600 transition-colors">
                      <Icon className="w-6 h-6 text-sky-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector for Desktop (between cards) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
