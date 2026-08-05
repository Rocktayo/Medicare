import React from 'react';
import { Calendar, PhoneCall, ShieldCheck, HeartPulse } from 'lucide-react';

interface CallToActionProps {
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenBooking, onOpenEmergency }) => {
  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B3D91] via-[#1E40AF] to-[#2563EB] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          
          {/* Background decorative circles */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-sky-300/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Prioritize Your Health Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
              Book Your Appointment Today
            </h2>

            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Take charge of your wellness. Select from over 150 top medical specialists and secure your consultation slot in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-[#0B3D91] bg-white hover:bg-sky-50 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Book Appointment Now</span>
              </button>

              <button
                onClick={onOpenEmergency}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-semibold text-white bg-red-600/90 hover:bg-red-600 border border-red-400/40 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-white animate-bounce" />
                <span>24/7 Emergency Line</span>
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Confirmation</span>
              </div>
              <div>&bull;</div>
              <div>No Advance Payment Required</div>
              <div>&bull;</div>
              <div>Free Rescheduling</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
